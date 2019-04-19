import SyncPromise from "jest-mock-promise";

export interface HttpResponse {
    data: any;
    status?: number;
    statusText?: string;
    headers?: object;
    config?: object;
}

export type AnyFunction = (...args: any[]) => any;

// spy is a function which extends an object (it has static methods and properties)
export type SpyFn = AnyFunction & { mockClear: AnyFunction };

export type AxiosFn = (...args: any[]) => SpyFn;

type Interceptors = {
    request: {
        use: SpyFn
    },
    response: {
        use: SpyFn
    }
};

type AxiosDefaults = {
    headers: any
};

export interface AxiosAPI {
    // mocking Axios methods
    get: jest.Mock<SyncPromise, [string?, any?, any?]>;
    post: jest.Mock<SyncPromise, [string?, any?, any?]>;
    put: jest.Mock<SyncPromise, [string?, any?, any?]>;
    patch: jest.Mock<SyncPromise, [string?, any?, any?]>;
    delete: jest.Mock<SyncPromise, [string?, any?, any?]>;
    head: jest.Mock<SyncPromise, [string?, any?, any?]>;
    options: jest.Mock<SyncPromise, [string?, any?, any?]>;
    request: jest.Mock<SyncPromise, [any?]>;
    all: SpyFn;
    create: jest.Mock<AxiosMockType, []>;
    interceptors: Interceptors;
    defaults: AxiosDefaults;
}

export interface AxiosMockAPI {
    /**
     * Simulate a server response, (optionally) with the given data
     * @param response (optional) response returned by the server
     * @param queueItem (optional) request promise for which response should be resolved
     * @param silentMode (optional) specifies whether the call should throw an error or only fail quietly if no matching request is found.
     */
    mockResponse: ((response?: HttpResponse, queueItem?: SyncPromise|AxiosMockQueueItem, silentMode?: boolean) => void);
    /**
     * Simulate an error in server request
     * @param error (optional) error object
     * @param queueItem (optional) request promise for which response should be resolved
     * @param silentMode (optional) specifies whether the call should throw an error or only fail quietly if no matching request is found.
     */
    mockError?: (error?: any, queueItem?: SyncPromise|AxiosMockQueueItem, silentMode?: boolean) => void;
    /**
     * Returns promise of the most recent request
     */
    lastPromiseGet?: () => SyncPromise;
    /**
     * Removes the give promise from the queue
     * @param promise
     */

    popPromise?: (promise?: SyncPromise) => SyncPromise;
    /**
     * Returns promise of the most recent request
     */
    lastReqGet?: () => AxiosMockQueueItem;
    /**
     * Removes the give request from the queue
     * @param promise
     */
    popRequest?: (promise?: AxiosMockQueueItem) => AxiosMockQueueItem;

    /**
     * Clears all of the queued requests
     */
    reset: () => void;
}

export interface AxiosMockQueueItem {
    promise: SyncPromise;
    url: string;
    data?: any;
    config?: any;
}

/**
 * Axios object can be called like a function,
 * that's why we're defining it as a spy
 */
export type AxiosMockType = AxiosFn & AxiosAPI & AxiosMockAPI;
