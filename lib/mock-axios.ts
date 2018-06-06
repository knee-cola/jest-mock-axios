/**
 * TypeScript version of Axios mock for unoit testing with [Jest](https://facebook.github.io/jest/).
 * This file is based on https://gist.github.com/tux4/36006a1859323f779ab0
 * 
 * @author   knee-cola <nikola.derezic@gmail.com>
 * @license  @license MIT License, http://www.opensource.org/licenses/MIT
 */

import SyncPromise from 'jest-mock-promise';
import { HttpResponse, AnyFunction, SpyFn, AxiosMockType, AxiosMockQueueItem } from './mock-axios-types';

/** a FIFO queue of pending request */
const _pending_requests:Array<AxiosMockQueueItem> = [];

const _newReq:(url:string,data?:any,config?:any)=>SyncPromise = (url:string,data?:any,config?:any) => {
  let promise:SyncPromise = new SyncPromise();
  _pending_requests.push({
    promise:promise,
    url:url,
    data:data,
    config:config
  })
  return(promise);
}

const MockAxios:AxiosMockType = <AxiosMockType>jest.fn(_newReq);

// mocking Axios methods
MockAxios.get = jest.fn(_newReq);
MockAxios.post = jest.fn(_newReq);
MockAxios.put = jest.fn(_newReq);
MockAxios.patch = jest.fn(_newReq);
MockAxios.delete = jest.fn(_newReq);
MockAxios.create = jest.fn(() => MockAxios);

MockAxios.popPromise = (promise?:SyncPromise) => {

  if(promise) {
    // remove the promise from pending queue
    for (let ix = 0; ix < _pending_requests.length; ix++) {

      let req:AxiosMockQueueItem = _pending_requests[ix];

      if(req.promise === promise) {
        _pending_requests.splice(ix, 1);
        return(req.promise);
      }
    }
    
  } else {
    // take the oldest promise
    let req:AxiosMockQueueItem = _pending_requests.shift();
    return(req ? req.promise : void 0);
  }
}


MockAxios.popRequest = (request?:AxiosMockQueueItem) => {

  if(request) {
    const ix = _pending_requests.indexOf(request);
    if(ix===-1) {
      return(void 0);
    }

    _pending_requests.splice(ix, 1);
    return(request);

  } else {
    return(_pending_requests.shift());
  }
}

/**
 * Removes an item form the queue, based on it's type
 * @param queueItem 
 */
const popQueueItem = (queueItem:SyncPromise|AxiosMockQueueItem=null) => {
  // first le't pretend the param is a queue item
  let request:AxiosMockQueueItem = MockAxios.popRequest(<AxiosMockQueueItem>queueItem),
      promise:SyncPromise;

  if(request) {
  // IF the request was found
  // > set the promise
    return(request.promise);
  } else {
  // ELSE maybe the `queueItem` is a promise (legacy mode)
    return(MockAxios.popPromise(<SyncPromise>queueItem));
  }
}

MockAxios.mockResponse = (response?:HttpResponse, queueItem:SyncPromise|AxiosMockQueueItem=null):void => {

  // replacing missing data with default values
  response = Object.assign({
    data: {},
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  }, response);

  // resolving the Promise with the given response data
  popQueueItem(queueItem).resolve(response);
}

MockAxios.mockError = (error:any={}, queueItem:SyncPromise|AxiosMockQueueItem=null) => {
  // resolving the Promise with the given response data
  popQueueItem(queueItem).reject(Object.assign({}, error));
}

MockAxios.lastReqGet = () => {
  return(_pending_requests[_pending_requests.length-1]);
}

MockAxios.lastPromiseGet = () => {
  const req = MockAxios.lastReqGet();
  return(req ? req.promise : void 0);
}

MockAxios.reset = () => {
  // remove all the requests
  _pending_requests.splice(0, _pending_requests.length);

  // resets all information stored in the mockFn.mock.calls and mockFn.mock.instances arrays
  MockAxios.get.mockClear();
  MockAxios.post.mockClear();
  MockAxios.put.mockClear();
  MockAxios.patch.mockClear();
  MockAxios.delete.mockClear();
}

// this is a singletone object
export default MockAxios;
