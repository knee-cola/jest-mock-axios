/**
 * TypeScript version of Axios mock for unoit testing with [Jest](https://facebook.github.io/jest/).
 * This file is based on https://gist.github.com/tux4/36006a1859323f779ab0
 * 
 * @author   knee-cola <nikola.derezic@gmail.com>
 * @license  @license MIT License, http://www.opensource.org/licenses/MIT
 */

import SyncPromise from 'jest-mock-promise';
import {HttpResponse, AnyFunction, SpyFn} from './mock-axios-types';

class MockAxios {

  /** a FIFO queue of pending request */
  private pending_promises:Array<SyncPromise> = [];

  // mocking Axios methods
  public get:SpyFn = jest.fn(this.newReq.bind(this))
  public post:SpyFn = jest.fn(this.newReq.bind(this))
  public put:SpyFn = jest.fn(this.newReq.bind(this))
  public delete:SpyFn = jest.fn(this.newReq.bind(this))

  private newReq():any {
    let promise = new SyncPromise()
    this.pending_promises.push(promise);
    return(promise);
  }

  /**
   * Removes the give promise from the queue
   * @param promise 
   */
  private popPromise(promise?:SyncPromise) {

    if(promise) {
      // remove the promise from pending queue
      this.pending_promises.splice(this.pending_promises.indexOf(promise),1)
    } else {
      // take the oldest promise
      promise = this.pending_promises.shift();
    }

    return(promise);
  }

  /**
   * Simulate a server response, (optionally) with the given data
   * @param response (optional) response returned by the server
   * @param promise (optional) request promise for which response should be resolved
   */
  public mockResponse(response?:HttpResponse, promise:SyncPromise=null):void {
    
    // remove promise from the queue
    promise = this.popPromise(promise);
  
    // replacing missing data with default values
    response = Object.assign({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    }, response);
  
    // resolving the Promise with the given response data
    promise.resolve(response);
  }

  /**
   * Simulate an error in server request
   * @param error (optional) error object
   */
  public mockError(error:any={}, promise:SyncPromise=null):void {
    // remove promise from the queue
    promise = this.popPromise(promise);
    // resolving the Promise with the given response data
    promise.reject(Object.assign({}, error));
  }

  /**
   * Returns promise of the most recent request
   */
  public lastReqGet():SyncPromise {
    return(this.pending_promises[this.pending_promises.length-1]);
  }

  /**
   * Clears all of the queued requests
   */
  public reset() {
    this.pending_promises.splice(0, this.pending_promises.length);

    // resets all information stored in the mockFn.mock.calls and mockFn.mock.instances arrays
    this.get.mockClear();
    this.post.mockClear();
    this.put.mockClear();
    this.delete.mockClear();
  }
};

// this is a singletone object
export default MockAxios;