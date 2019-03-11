import SyncPromise from 'jest-mock-promise';

type HttpResponse = {
    data:any,
    status?:number,
    statusText?:string,
    headers?:object,
    config?:object,
}

type AnyFunction = (...args:any[]) => any;

// spy is a function which extends an object (it has static methods and properties)
type SpyFn = AnyFunction & { mockClear:AnyFunction };

type AxiosFn = (...args:any[]) => SpyFn;

type AxiosAPI = {
    // mocking Axios methods
    get?:SpyFn;
    post?:SpyFn;
    put?:SpyFn;
    patch?:SpyFn;
    delete?:SpyFn;
    create?:SpyFn;
};

type AxiosMockAPI = {
    /**
     * Simulate a server response, (optionaly) with the given data
     * @param response (optional) response returned by the server
     * @param promise (optional) request promise for which response should be resolved
     */
    mockResponse?:((response?:HttpResponse, queueItem?:SyncPromise|AxiosMockQueueItem) => void);
    /**
     * Simulate an error in server request
     * @param error (optional) error object
     */
    mockError?:(error?:any, queueItem?:SyncPromise|AxiosMockQueueItem) => void;
    /**
     * Returns promise of the most recent request
     */
    lastPromiseGet?:()=>SyncPromise;
    /**
     * Removes the give promise from the queue
     * @param promise 
     */

    popPromise?:(promise?:SyncPromise) => SyncPromise;
    /**
     * Returns promise of the most recent request
     */
    lastReqGet?:()=>AxiosMockQueueItem;
    /**
     * Removes the give request from the queue
     * @param promise 
     */
    popRequest?:(promise?:AxiosMockQueueItem) => AxiosMockQueueItem;

    /**
     * Clears all of the queued requests
     */
    reset?:()=>void;
}

type AxiosMockQueueItem = {
    promise:SyncPromise,
    url:string,
    data?:any,
    config?:any
};

/**
 * Axios object can be called like a function,
 * that's why we're defining it as a spy
 */
type AxiosMockType = AxiosFn & AxiosAPI & AxiosMockAPI;

export { HttpResponse, AnyFunction, SpyFn, AxiosMockType, AxiosFn, AxiosAPI, AxiosMockAPI, AxiosMockQueueItem }
