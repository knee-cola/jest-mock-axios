import SyncPromise from 'jest-mock-promise';

type HttpResponse = {
    data:object,
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
    delete?:SpyFn;
    create?:SpyFn;
};

type AxiosMockAPI = {
    /**
     * Simulate a server response, (optionaly) with the given data
     * @param response (optional) response returned by the server
     * @param promise (optional) request promise for which response should be resolved
     */
    mockResponse?:((response?:HttpResponse, promise?:SyncPromise) => void);
    /**
     * Simulate an error in server request
     * @param error (optional) error object
     */
    mockError?:(error?:any, promise?:SyncPromise) => void;
    /**
     * Returns promise of the most recent request
     */
    lastReqGet?:()=>SyncPromise;
    /**
     * Clears all of the queued requests
     */
    reset?:()=>void;
    /**
     * Removes the give promise from the queue
     * @param promise 
     */
    popPromise?:(promise?:SyncPromise) => SyncPromise;
}

/**
 * Axios object can be called like a function,
 * that's why we're defining it as a spy
 */
type AxiosMockType = AxiosFn & AxiosAPI & AxiosMockAPI;

export { HttpResponse, AnyFunction, SpyFn, AxiosMockType, AxiosFn, AxiosAPI, AxiosMockAPI }