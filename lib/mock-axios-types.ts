import { SynchronousPromise, UnresolvedSynchronousPromise  } from "synchronous-promise";

export interface HttpResponse {
    data: any;
    status?: number;
    statusText?: string;
    headers?: object;
    config?: object;
}

interface Interceptors {
    request: {
        use: jest.Mock<number, [any?, any?]>;
    };
    response: {
        use: jest.Mock<number, [any?, any?]>;
    };
}

interface AxiosDefaults {
    headers: any;
}

export interface AxiosAPI {
    // mocking Axios methods
    get: jest.Mock<UnresolvedSynchronousPromise<any>, [string?, any?]>;
    post: jest.Mock<UnresolvedSynchronousPromise<any>, [string?, any?, any?]>;
    put: jest.Mock<UnresolvedSynchronousPromise<any>, [string?, any?, any?]>;
    patch: jest.Mock<UnresolvedSynchronousPromise<any>, [string?, any?, any?]>;
    delete: jest.Mock<UnresolvedSynchronousPromise<any>, [string?, any?]>;
    head: jest.Mock<UnresolvedSynchronousPromise<any>, [string?, any?]>;
    options: jest.Mock<UnresolvedSynchronousPromise<any>, [string?, any?]>;
    request: jest.Mock<UnresolvedSynchronousPromise<any>, [any?]>;
    all: jest.Mock<Promise<any>, [any]>;
    create: jest.Mock<AxiosMockType, []>;
    interceptors: Interceptors;
    defaults: AxiosDefaults;
}

interface Cancel {
    message: string;
}

type CancelStatic = new (message?: string) => Cancel;
interface CancelToken {
    promise: Promise<Cancel>;
    reason?: Cancel;
    throwIfRequested(): void;
}
type Canceler = (message?: string) => void;
interface CancelTokenSource {
    token: CancelToken;
    cancel: Canceler;
}
interface CancelTokenStatic {
    new (executor: (cancel: Canceler) => void): CancelToken;
    source(): CancelTokenSource;
}

export interface AxiosMockAPI {
    /**
     * Simulates a server response, (optionally) with the given data
     * @param response (optional) response returned by the server
     * @param queueItem (optional) request promise for which response should be resolved
     * @param silentMode (optional) specifies whether the call should throw an error or
     *   only fail quietly if no matching request is found. Defaults to false.
     */
    mockResponse: (
        response?: HttpResponse,
        queueItem?: Promise<any> | AxiosMockQueueItem,
        silentMode?: boolean,
    ) => void;

    /**
     * Simulates a server response for a specific request, (optionally) with the given data
     * @param criteria specifies which request should be resolved; it can be just the URL
     *   or an object containing url and/or method
     * @param response (optional) response returned by the server
     * @param silentMode (optional) specifies whether the call should throw an error or
     *   only fail quietly if no matching request is found. Defaults to false.
     */
    mockResponseFor: (
        criteria: string | AxiosMockRequestCriteria,
        response?: HttpResponse,
        silentMode?: boolean,
    ) => void;

    /**
     * Simulates an error in server request
     * @param error (optional) error object
     * @param queueItem (optional) request promise for which response should be resolved
     * @param silentMode (optional) specifies whether the call should throw an error or
     *   only fail quietly if no matching request is found.
     */
    mockError: (
        error?: any,
        queueItem?: Promise<any> | AxiosMockQueueItem,
        silentMode?: boolean,
    ) => void;

    /**
     * Returns promise of the most recent request
     */
    lastPromiseGet: () => SynchronousPromise<any>;

    /**
     * Removes the give promise from the queue
     * @param promise
     */

    popPromise: (promise?: UnresolvedSynchronousPromise<any>) => UnresolvedSynchronousPromise<any>;

    /**
     * Returns request item of the most recent request
     */
    lastReqGet: () => AxiosMockQueueItem;

    /**
     * Returns request item of the most recent request with the given criteria
     * Returns undefined if no matching request could be found
     *
     * The result can then be used with @see mockResponse; in most cases it is better
     * to use @see mockResponseFor instead of calling this function yourself
     *
     * @param criteria the criteria by which to find the request
     */
    getReqMatching: (criteria: AxiosMockRequestCriteria) => AxiosMockQueueItem;

    /**
     * Returns request item of the most recent request with the given url
     * The url must equal the url given in the 1st parameter when the request was made
     * Returns undefined if no matching request could be found
     *
     * The result can then be used with @see mockResponse
     *
     * @param url the url of the request to be found
     */
    getReqByUrl: (url: string) => AxiosMockQueueItem;

    /**
     * Removes the give request from the queue
     * @param promise
     */
    popRequest: (promise?: AxiosMockQueueItem) => AxiosMockQueueItem;

    /**
     * Clears all of the queued requests
     */
    reset: () => void;

    Cancel: CancelStatic;
    CancelToken: CancelTokenStatic;
    isCancel(value: any): boolean;
}

export interface AxiosMockQueueItem {
    promise: UnresolvedSynchronousPromise<any>;
    method: string;
    url: string;
    data?: any;
    config?: any;
}

export interface AxiosMockRequestCriteria {
    url?: string;
    method?: string;
}

/**
 * Axios object can be called like a function,
 * that's why we're defining it as a spy
 */
export type AxiosMockType = AxiosAPI & AxiosMockAPI & jest.Mock<UnresolvedSynchronousPromise<any>, [any?]>;
