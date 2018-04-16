import MockAxios from '../lib/index';
import SyncPromise from 'jest-mock-promise';

describe('MockAxios', () => {

    afterEach(() => {
        MockAxios.reset();
    });
  
    it(`should return a promise when called directly`, () => {
        expect(typeof MockAxios).toBe('function');
        expect(MockAxios()).toEqual(new SyncPromise);
    });
    it("`get` should return a promise", () => {
        expect(MockAxios.get()).toEqual(new SyncPromise());
    });
    it("`put` should return a promise", () => {
        expect(MockAxios.put()).toEqual(new SyncPromise());
    });
    it("`post` should return a promise", () => {
        expect(MockAxios.post()).toEqual(new SyncPromise());
    });
    it("`delete` should return a promise", () => {
        expect(MockAxios.delete()).toEqual(new SyncPromise());
    });
    it("`create` should return reference to MockAxios itself", () => {
        expect(MockAxios.create()).toBe(MockAxios);
    });

    // mockResponse - Simulate a server response, (optionaly) with the given data
    it("`mockResponse` should resolve the given promise with the provided response", () => {
        let thenFn = jest.fn();
        MockAxios.post().then(thenFn);

        let responseData = { data: {text:"some data" } };
        let responseObj = {"config": {}, "data": responseData.data, "headers": {}, "status": 200, "statusText": "OK"};
        MockAxios.mockResponse(responseObj);
        
        expect(thenFn).toHaveBeenCalledWith(responseObj);    
    });

    it("`mockResponse` should remove the last promise from the queue", () => {
        MockAxios.post();
        MockAxios.mockResponse();
        expect(MockAxios.popPromise()).toBeUndefined();
    });

    it("`mockResponse` resolve the provided promise", () => {
        let firstFn = jest.fn();
        let secondFn = jest.fn();
        let thirdFn = jest.fn();

        let firstPromise = MockAxios.post().then(firstFn);
        let secondPromise = MockAxios.post().then(secondFn);
        let thirdPromise = MockAxios.post().then(thirdFn);

        let responseData = { data: {text:"some data" } };
        let responseObj = {"config": {}, "data": responseData.data, "headers": {}, "status": 200, "statusText": "OK"};
        MockAxios.mockResponse(responseObj, secondPromise);
        
        expect(firstFn).not.toHaveBeenCalled();
        expect(secondFn).toHaveBeenCalledWith(responseObj);
        expect(thirdFn).not.toHaveBeenCalled();
    });

    it("`mockResponse` should resolve the last given promise if none was provided", () => {
        let firstPromise = MockAxios.post();
        let secondPromise = MockAxios.post();
        let thirdPromise = MockAxios.post();

        let firstThen = jest.fn();
        let secondThen = jest.fn();
        let thirdThen = jest.fn();

        firstPromise.then(firstThen);
        secondPromise.then(secondThen);
        thirdPromise.then(thirdThen);

        MockAxios.mockResponse();
        
        expect(firstThen).toHaveBeenCalled();
        expect(secondThen).not.toHaveBeenCalled();
        expect(thirdThen).not.toHaveBeenCalled();

        MockAxios.mockResponse();
        
        expect(secondThen).toHaveBeenCalled();
        expect(thirdThen).not.toHaveBeenCalled();

        MockAxios.mockResponse();
        
        expect(thirdThen).toHaveBeenCalled();

        // functions should be called once only
        expect(firstThen.mock.calls.length).toBe(1);
        expect(secondThen.mock.calls.length).toBe(1);
        expect(thirdThen.mock.calls.length).toBe(1);
    });
    
    // mockError - Simulate an error in server request
    it("`mockError` should fail the given promise with the provided response", () => {
        let thenFn = jest.fn();
        let catchFn = jest.fn();
        let promise = MockAxios.post().then(thenFn).catch(catchFn);

        let errorObj = { n:"this is an error" };

        MockAxios.mockError(errorObj, promise);
        expect(catchFn).toHaveBeenCalledWith(errorObj);
        expect(thenFn).not.toHaveBeenCalledWith(errorObj);
    });

    it("`mockError` should remove the promise from the queue", () => {
        MockAxios.post();
        MockAxios.mockError();
        expect(MockAxios.popPromise()).toBeUndefined();
      });
      
      it("`mockError` fail the provided promise", () => {
        let firstFn = jest.fn();
        let secondFn = jest.fn();
        let thirdFn = jest.fn();
      
        let firstPromise = MockAxios.post().catch(firstFn);
        let secondPromise = MockAxios.post().catch(secondFn);
        let thirdPromise = MockAxios.post().catch(thirdFn);
      
        MockAxios.mockError({}, secondPromise);
        
        expect(firstFn).not.toHaveBeenCalled();
        expect(secondFn).toHaveBeenCalled();
        expect(thirdFn).not.toHaveBeenCalled();
      });
      
      it("`mockError` should fail the last given promise if none was provided", () => {
        let firstPromise = MockAxios.post();
        let secondPromise = MockAxios.post();
        let thirdPromise = MockAxios.post();
      
        let firstFn = jest.fn();
        let secondFn = jest.fn();
        let thirdFn = jest.fn();
      
        firstPromise.catch(firstFn);
        secondPromise.catch(secondFn);
        thirdPromise.catch(thirdFn);
      
        MockAxios.mockError({});
        
        expect(firstFn).toHaveBeenCalled();
        expect(secondFn).not.toHaveBeenCalled();
        expect(thirdFn).not.toHaveBeenCalled();
      
        MockAxios.mockError();
        
        expect(secondFn).toHaveBeenCalled();
        expect(thirdFn).not.toHaveBeenCalled();
      
        MockAxios.mockError();
        
        expect(thirdFn).toHaveBeenCalled();
      
        // functions should be called once only
        expect(firstFn.mock.calls.length).toBe(1);
        expect(secondFn.mock.calls.length).toBe(1);
        expect(thirdFn.mock.calls.length).toBe(1);
      });
    
    // lastReqGet - returns the most recent request
    it("`lastReqGet` should return the most recent request", () => {
        let thenFn = jest.fn();
        let firstPromise = MockAxios.post();
        let lastPromise = MockAxios.post();

        expect(MockAxios.lastReqGet().promise).toBe(lastPromise);
    });
    
    // lastPromiseGet - Returns promise of the most recent request
    it("`lastPromiseGet` should return the most recent promise", () => {
        let thenFn = jest.fn();
        let firstPromise = MockAxios.post();
        let lastPromise = MockAxios.post();

        expect(MockAxios.lastPromiseGet()).toBe(lastPromise);
    });

    // popPromise - Removes the give promise from the queue
    it("`popPromise` should remove the given promise from the queue", () => {
        let thenFn = jest.fn();

        let firstPromise = MockAxios.post();
        let secondPromise = MockAxios.post();
        let thirdPromise = MockAxios.post();

        expect(MockAxios.popPromise(firstPromise)).toBe(firstPromise);
        expect(MockAxios.popPromise(thirdPromise)).toBe(thirdPromise);
        expect(MockAxios.popPromise(secondPromise)).toBe(secondPromise);

        // queue should be empty
        expect(MockAxios.lastPromiseGet()).toBeUndefined();
    });

    // popPromise - Removes the give promise from the queue
    it("`popRequest` should remove the given request from the queue", () => {
        let thenFn = jest.fn();

        MockAxios.post();
        let firstReq = MockAxios.lastReqGet();
        MockAxios.post();
        let secondReq = MockAxios.lastReqGet();
        MockAxios.post();
        let thirdReq = MockAxios.lastReqGet();

        expect(MockAxios.popRequest(firstReq)).toBe(firstReq);
        expect(MockAxios.popRequest(thirdReq)).toBe(thirdReq);
        expect(MockAxios.popRequest(secondReq)).toBe(secondReq);

        // queue should be empty
        expect(MockAxios.lastReqGet()).toBeUndefined();
    });

    // reset - Clears all of the queued requests
    it("`reset` should clear all the queued requests", () => {
        let thenFn = jest.fn();

        let firstPromise = MockAxios.post();
        let lastPromise = MockAxios.post();

        MockAxios.reset();
        MockAxios.reset();

        expect(MockAxios.lastReqGet()).toBeUndefined();
    });

    it("`reset` should clear clear all the spy statistics", () => {
        MockAxios.post();
        MockAxios.get();
        MockAxios.put();
        MockAxios.delete();

        expect(MockAxios.post).toHaveBeenCalled();
        expect(MockAxios.get).toHaveBeenCalled();
        expect(MockAxios.put).toHaveBeenCalled();
        expect(MockAxios.delete).toHaveBeenCalled();

        MockAxios.reset();

        expect(MockAxios.post).not.toHaveBeenCalled();
        expect(MockAxios.get).not.toHaveBeenCalled();
        expect(MockAxios.put).not.toHaveBeenCalled();
        expect(MockAxios.delete).not.toHaveBeenCalled();
    });
});