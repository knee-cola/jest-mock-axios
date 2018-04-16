/**
 * TypeScript version of Axios mock for unoit testing with [Jest](https://facebook.github.io/jest/).
 * This file is based on https://gist.github.com/tux4/36006a1859323f779ab0
 * 
 * @author   knee-cola <nikola.derezic@gmail.com>
 * @license  @license MIT License, http://www.opensource.org/licenses/MIT
 */

import SyncPromise from 'jest-mock-promise';
import { HttpResponse, AnyFunction, SpyFn, AxiosMockType } from './mock-axios-types';

const _newReq:()=>SyncPromise = () => {
  let promise:SyncPromise = new SyncPromise()
  _pending_promises.push(promise);
  return(promise);
}

/** a FIFO queue of pending request */
const _pending_promises:Array<SyncPromise> = [];
const MockAxios:AxiosMockType = <AxiosMockType>jest.fn(_newReq);

// mocking Axios methods
MockAxios.get = jest.fn(_newReq);
MockAxios.post = jest.fn(_newReq);
MockAxios.put = jest.fn(_newReq);
MockAxios.delete = jest.fn(_newReq);
MockAxios.create = jest.fn(() => MockAxios);

MockAxios.popPromise = (promise?:SyncPromise) => {

  if(promise) {
    // remove the promise from pending queue
    _pending_promises.splice(_pending_promises.indexOf(promise),1)
  } else {
    // take the oldest promise
    promise = _pending_promises.shift();
  }

  return(promise);
}

MockAxios.mockResponse = (response?:HttpResponse, promise:SyncPromise=null):void => {
  
  // remove promise from the queue
  promise = MockAxios.popPromise(promise);

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

MockAxios.mockError = (error:any={}, promise:SyncPromise=null) => {
  // remove promise from the queue
  promise = MockAxios.popPromise(promise);
  // resolving the Promise with the given response data
  promise.reject(Object.assign({}, error));
}

MockAxios.lastReqGet = () => {
  return(_pending_promises[_pending_promises.length-1]);
}

MockAxios.reset = () => {
  _pending_promises.splice(0, _pending_promises.length);

  // resets all information stored in the mockFn.mock.calls and mockFn.mock.instances arrays
  MockAxios.get.mockClear();
  MockAxios.post.mockClear();
  MockAxios.put.mockClear();
  MockAxios.delete.mockClear();
}

// this is a singletone object
export default MockAxios;