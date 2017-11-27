/**
 * TypeScript version of Axios mock for unoit testing with [Jest](https://facebook.github.io/jest/).
 * This file is based on https://gist.github.com/tux4/36006a1859323f779ab0
 *
 * @author   knee-cola <nikola.derezic@gmail.com>
 * @license  @license MIT License, http://www.opensource.org/licenses/MIT
 */
import SyncPromise from 'jest-mock-promise';
import { HttpResponse, SpyFn } from './jest-mock-axios-types';
declare class JestMockAxios {
    /** a FIFO queue of pending request */
    private pending_promises;
    get: SpyFn;
    post: SpyFn;
    put: SpyFn;
    delete: SpyFn;
    private newReq();
    /**
     * Removes the give promise from the queue
     * @param promise
     */
    private popPromise(promise?);
    /**
     * Simulate a server response, (optionally) with the given data
     * @param response (optional) response returned by the server
     * @param promise (optional) request promise for which response should be resolved
     */
    mockResponse(response?: HttpResponse, promise?: SyncPromise): void;
    /**
     * Simulate an error in server request
     * @param error (optional) error object
     */
    mockError(error?: any, promise?: SyncPromise): void;
    /**
     * Returns promise of the most recent request
     */
    lastReqGet(): SyncPromise;
    /**
     * Clears all of the queued requests
     */
    reset(): void;
}
export { JestMockAxios };
