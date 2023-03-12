/**
 * TypeScript version of Axios mock for unit testing with [Jest](https://facebook.github.io/jest/).
 * This file is based on https://gist.github.com/tux4/36006a1859323f779ab0
 *
 * @author   knee-cola <nikola.derezic@gmail.com>
 * @license  @license MIT License, http://www.opensource.org/licenses/MIT
 */

import {jest} from '@jest/globals';

import { SynchronousPromise, UnresolvedSynchronousPromise } from "synchronous-promise";
import Cancel from "./cancel/Cancel";
import CancelToken from "./cancel/CancelToken";
import {
    AxiosMockQueueItem,
    AxiosMockRequestCriteria,
    AxiosMockType,
    HttpResponse,
    InterceptorsStack,
    RequestHandler,
} from "./mock-axios-types";

/** a FIFO queue of pending request */
const _pending_requests: AxiosMockQueueItem[] = [];
const _responseInterceptors: InterceptorsStack[] = [];
const _requestInterceptors: InterceptorsStack[] = [];

let _requestHandler: RequestHandler;

const processInterceptors = (data: any, stack: InterceptorsStack[], type: keyof InterceptorsStack) => {
    return stack.map(({[type]: interceptor}) => interceptor)
        .filter((interceptor) => !!interceptor)
        .reduce((_result, next) => {
            return next(_result);
        }, data);
}

const _newReq: (config?: any) => UnresolvedSynchronousPromise<any> = (config: any = {}, actualConfig: any = {}) => {
    if(typeof config === 'string') {
        // Allow for axios('example/url'[, config])
        actualConfig.url = config;
        config = actualConfig;
    }

    const method: string = config.method || "get";
    const url: string = config.url;
    const data: any = config.data;
    const promise: UnresolvedSynchronousPromise<any> = SynchronousPromise.unresolved();

    if(config.cancelToken) {
        config.cancelToken.promise.then((cancel: any) => {
            // check if promise is still waiting for an answer
            if(_pending_requests.find(x => x.promise === promise)) {
                MockAxios.mockError(cancel, promise)
            }
        })
    }

    const requestConfig = processInterceptors({
        config,
        data,
        method,
        promise,
        url
    }, _requestInterceptors, 'onFulfilled');

    _pending_requests.push(requestConfig);

    if (typeof _requestHandler === "function") {
        _requestHandler(requestConfig);
    }

    return promise;
};

const _helperReq = (method: string, url: string, data?: any, config?: any) => {
    const conf = data && config ? config : {};
    return _newReq({
        ...conf,
        data,
        method,
        url,
    });
};

const _helperReqNoData = (method: string, url: string, config?: any) => {
    return _helperReq(method, url, {}, config)
}

const MockAxios: AxiosMockType = (jest.fn(_newReq) as unknown) as AxiosMockType;

// mocking Axios methods
// @ts-ignore
MockAxios.get = jest.fn(_helperReqNoData.bind(null, "get"));
// @ts-ignore
MockAxios.post = jest.fn(_helperReq.bind(null, "post"));
// @ts-ignore
MockAxios.put = jest.fn(_helperReq.bind(null, "put"));
// @ts-ignore
MockAxios.patch = jest.fn(_helperReq.bind(null, "patch"));
// @ts-ignore
MockAxios.delete = jest.fn(_helperReqNoData.bind(null, "delete"));
// @ts-ignore
MockAxios.request = jest.fn(_newReq);
// @ts-ignore
MockAxios.all = jest.fn((values) => Promise.all(values));
// @ts-ignore
MockAxios.head = jest.fn(_helperReqNoData.bind(null, "head"));
// @ts-ignore
MockAxios.options = jest.fn(_helperReqNoData.bind(null, "options"));
// @ts-ignore
MockAxios.create = jest.fn(() => MockAxios);

MockAxios.interceptors = {
    request: {
        // @ts-ignore
        use: jest.fn((onFulfilled, onRejected) => {
            return _requestInterceptors.push({ onFulfilled, onRejected })
        }),
        // @ts-ignore
        eject: jest.fn((position: number) => {
            _requestInterceptors.splice(position - 1, 1);
        }),
        // @ts-ignore
        clear: jest.fn(() => {
            _requestInterceptors.length = 0;
        }),
    },
    response: {
        // @ts-ignore
        use: jest.fn((onFulfilled, onRejected) => {
            return _responseInterceptors.push({onFulfilled, onRejected});
        }),
        // @ts-ignore
        eject: jest.fn((position: number) => {
            _responseInterceptors.splice(position - 1, 1);
        }),
        // @ts-ignore
        clear: jest.fn(() => {
            _responseInterceptors.length = 0;
        }),
    },
};

MockAxios.defaults = {
    headers: {
        common: [],
        get: {},
        post: {},
        delete: {},
        put: {},
        patch: {},
        head: {}
    },
};

MockAxios.popPromise = (promise?: SynchronousPromise<any>) => {
    if (promise) {
        // remove the promise from pending queue
        for (let ix = 0; ix < _pending_requests.length; ix++) {
            const req: AxiosMockQueueItem = _pending_requests[ix];

            if (req.promise === promise) {
                _pending_requests.splice(ix, 1);
                return req.promise;
            }
        }
    } else {
        // take the oldest promise
        const req: AxiosMockQueueItem = _pending_requests.shift();
        return req ? req.promise : void 0;
    }
};

MockAxios.popRequest = (request?: AxiosMockQueueItem) => {
    if (request) {
        const ix = _pending_requests.indexOf(request);
        if (ix === -1) {
            return void 0;
        }

        _pending_requests.splice(ix, 1);
        return request;
    } else {
        return _pending_requests.shift();
    }
};

/**
 * Removes an item form the queue, based on it's type
 * @param queueItem
 */
const popQueueItem = (queueItem: SynchronousPromise<any> | AxiosMockQueueItem = null) => {
    // first let's pretend the param is a queue item
    const request: AxiosMockQueueItem = MockAxios.popRequest(
        queueItem as AxiosMockQueueItem,
    );

    if (request) {
        // IF the request was found
        // > set the promise
        return request.promise;
    } else {
        // ELSE maybe the `queueItem` is a promise (legacy mode)
        return MockAxios.popPromise(queueItem as UnresolvedSynchronousPromise<any>);
    }
};

MockAxios.mockResponse = (
    response?: HttpResponse,
    queueItem: SynchronousPromise<any> | AxiosMockQueueItem = null,
    silentMode: boolean = false,
): void => {
    // replacing missing data with default values
    response = Object.assign(
        {
            config: {},
            data: {},
            headers: {},
            status: 200,
            statusText: "OK",
        },
        response,
    );

    let promise = popQueueItem(queueItem);

    if (!promise && !silentMode) {
        throw new Error("No request to respond to!");
    } else if (!promise) {
        return;
    }

    for (const interceptor of _responseInterceptors) {
        promise = promise.then(interceptor.onFulfilled, interceptor.onRejected) as UnresolvedSynchronousPromise<any>;
    }

    // resolving the Promise with the given response data
    promise.resolve(response);
};

MockAxios.mockResponseFor = (
    criteria: string | AxiosMockRequestCriteria,
    response?: HttpResponse,
    silentMode: boolean = false,
): void => {
    if (typeof criteria === "string") {
        criteria = {url: criteria};
    }
    const queueItem = MockAxios.getReqMatching(criteria);

    if (!queueItem && !silentMode) {
        throw new Error("No request to respond to!");
    } else if (!queueItem) {
        return;
    }

    MockAxios.mockResponse(response, queueItem, silentMode);
};

MockAxios.mockError = (
    error: any = {},
    queueItem: SynchronousPromise<any> | AxiosMockQueueItem = null,
    silentMode: boolean = false,
) => {
    let promise = popQueueItem(queueItem);

    if (!promise && !silentMode) {
        throw new Error("No request to respond to!");
    } else if (!promise) {
        return;
    }

    if (error && typeof error === 'object' && error.isAxiosError === void 0) {
        error.isAxiosError = true;
    }

    for (const interceptor of _responseInterceptors) {
        promise = promise.then(interceptor.onFulfilled, interceptor.onRejected) as UnresolvedSynchronousPromise<any>;;
    }

    // resolving the Promise with the given error
    promise.reject(error);
};

MockAxios.isAxiosError = (payload) => (typeof payload === 'object') && (payload.isAxiosError === true);

MockAxios.lastReqGet = () => {
    return _pending_requests[_pending_requests.length - 1];
};

MockAxios.lastPromiseGet = () => {
    const req = MockAxios.lastReqGet();
    return req ? req.promise : void 0;
};

const _findReqByPredicate = (predicate: (item: AxiosMockQueueItem) => boolean) => {
    return _pending_requests
    .slice()
    .reverse() // reverse cloned array to return most recent req
    .find(predicate);
}

const _checkCriteria = (item: AxiosMockQueueItem, criteria: AxiosMockRequestCriteria) => {
    if (criteria.method !== undefined && criteria.method.toLowerCase() !== item.method.toLowerCase()) {
        return false;
    }

    if (criteria.url !== undefined && criteria.url !== item.url) {
        return false;
    }

    if(criteria.params !== undefined) {
        if(item.config === undefined || !item.config.params || (typeof item.config.params !== 'object') ) {
          return false;
        }

        const paramsMatching = Object.entries(criteria.params).every(([key, value]) => item.config.params[key] === value);
        if(!paramsMatching) {
            return false;
        }
    }

    return true;
};

MockAxios.getReqMatching = (criteria: AxiosMockRequestCriteria) => {
    return _findReqByPredicate((x) => _checkCriteria(x, criteria));
};

MockAxios.getReqByUrl = (url: string) => {
    return MockAxios.getReqMatching({url});
};

MockAxios.getReqByMatchUrl = (url: RegExp) => {
    return _findReqByPredicate((x) => url.test(x.url));
};

MockAxios.getReqByRegex = (opts: {[key in keyof AxiosMockQueueItem]+?: RegExp}) => {
  return _findReqByPredicate(x => Object.entries(opts).every(([key, value]) => value.test(JSON.stringify(x[key]))));
};

MockAxios.queue = () => {
    return _pending_requests;
};

MockAxios.reset = () => {
    // remove all the requests
    _pending_requests.splice(0, _pending_requests.length);

    // resets all information stored in the mockFn.mock.calls and mockFn.mock.instances arrays
    MockAxios.get.mockClear();
    MockAxios.post.mockClear();
    MockAxios.put.mockClear();
    MockAxios.patch.mockClear();
    MockAxios.delete.mockClear();
    MockAxios.head.mockClear();
    MockAxios.options.mockClear();
    MockAxios.request.mockClear();
    MockAxios.all.mockClear();


    MockAxios.interceptors.request.clear();
    MockAxios.interceptors.response.clear();
};

MockAxios.requestHandler = (handler: RequestHandler) => {
    _requestHandler = handler;
}

MockAxios.Cancel = Cancel;
MockAxios.CancelToken = CancelToken;
MockAxios.isCancel = (u): u is Cancel => {
    return !!(u && u.__CANCEL__);
};

// this is a singleton object
export default MockAxios;
