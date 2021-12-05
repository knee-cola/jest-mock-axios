import { SynchronousPromise, UnresolvedSynchronousPromise } from "synchronous-promise";
import MockAxios from "../lib/index";

describe("MockAxios", () => {
    afterEach(() => {
        MockAxios.reset();
    });

    it(`should return a promise when called directly`, () => {
        expect(typeof MockAxios).toBe("function");
        expect(MockAxios()).toBeInstanceOf(SynchronousPromise);
    });

    describe("axios instance methods", () => {
        it("`get` should return a promise", () => {
            expect(MockAxios.get()).toBeInstanceOf(SynchronousPromise);
        });
        it("`put` should return a promise", () => {
            expect(MockAxios.put()).toBeInstanceOf(SynchronousPromise);
        });
        it("`patch` should return a promise", () => {
            expect(MockAxios.patch()).toBeInstanceOf(SynchronousPromise);
        });
        it("`post` should return a promise", () => {
            expect(MockAxios.post()).toBeInstanceOf(SynchronousPromise);
        });
        it("`delete` should return a promise", () => {
            expect(MockAxios.delete()).toBeInstanceOf(SynchronousPromise);
        });
        it("`head` should return a promise", () => {
            expect(MockAxios.head()).toBeInstanceOf(SynchronousPromise);
        });
        it("`options` should return a promise", () => {
            expect(MockAxios.options()).toBeInstanceOf(SynchronousPromise);
        });
        it("`request` should return a promise", () => {
            expect(MockAxios.request()).toBeInstanceOf(SynchronousPromise);
        });
        it("`all` should return a promise", () => {
            const promise = Promise.resolve("");
            expect(MockAxios.all([promise])).toBeInstanceOf(Promise);
        });
        it("`create` should return reference to MockAxios itself", () => {
            expect(MockAxios.create()).toBe(MockAxios);
        });
    });

    describe("mockResponse", () => {
        // mockResponse - Simulate a server response, (optionally) with the given data
        it("`mockResponse` should resolve the given promise with the provided response", () => {
            const thenFn = jest.fn();
            MockAxios.post().then(thenFn);

            const responseData = { data: { text: "some data" } };
            const responseObj = {
                config: {},
                data: responseData.data,
                headers: {},
                status: 200,
                statusText: "OK",
            };
            MockAxios.mockResponse(responseObj);

            expect(thenFn).toHaveBeenCalledWith(responseObj);
        });

        it("`mockResponse` should remove the last promise from the queue", () => {
            MockAxios.post();
            MockAxios.mockResponse();
            expect(MockAxios.popPromise()).toBeUndefined();
        });

        it("`mockResponse` should resolve the provided promise", () => {
            const firstFn = jest.fn();
            const secondFn = jest.fn();
            const thirdFn = jest.fn();

            MockAxios.post().then(firstFn);
            const secondPromise = MockAxios.post();
            secondPromise.then(secondFn);
            MockAxios.post().then(thirdFn);

            const responseData = { data: { text: "some data" } };
            const responseObj = {
                config: {},
                data: responseData.data,
                headers: {},
                status: 200,
                statusText: "OK",
            };
            MockAxios.mockResponse(responseObj, secondPromise);

            expect(firstFn).not.toHaveBeenCalled();
            expect(secondFn).toHaveBeenCalledWith(responseObj);
            expect(thirdFn).not.toHaveBeenCalled();
        });

        it("`mockResponse` should resolve the last given promise if none was provided", () => {
            const firstPromise = MockAxios.post();
            const secondPromise = MockAxios.post();
            const thirdPromise = MockAxios.post();

            const firstThen = jest.fn();
            const secondThen = jest.fn();
            const thirdThen = jest.fn();

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

        it("`mockResponse` should throw a specific error if no request can be resolved", () => {
            expect(() => MockAxios.mockResponse()).toThrowError(
                "No request to respond to!",
            );
        });

        it("`mockResponse` should not throw a specific error if silentMode is true", () => {
            expect(() =>
                MockAxios.mockResponse(undefined, undefined, true),
            ).not.toThrow();
        });

        it("`mockResponse` should work when used with async / await", async () => {
            const thenFn = jest.fn();
            const promise = MockAxios.post().then(thenFn);

            const responseData = { data: { text: "some data" } };
            MockAxios.mockResponse(responseData);

            await promise;
            expect(thenFn).toHaveBeenCalled();
        });
    });

    describe("mockResponseFor", () => {
        it("`mockResponseFor` should get the correct request using the shortcut", () => {
            const url = "url";
            const thenFn = jest.fn();
            MockAxios.post(url).then(thenFn);
            MockAxios.get("otherurl");
            MockAxios.mockResponseFor(url);
            expect(thenFn).toHaveBeenCalled();
        });

        it("`mockResponseFor` should get the correct request when axios() ist called directly", () => {
            const url = "url";
            const thenFn = jest.fn();
            MockAxios.post("otherurl");
            MockAxios(url).then(thenFn);
            MockAxios.mockResponseFor(url);
            expect(thenFn).toHaveBeenCalled();
        });

        it("`mockResponseFor` should get the correct request", () => {
            const url = "url";
            const thenFn = jest.fn();
            MockAxios.post(url).then(thenFn);
            MockAxios.get(url);
            MockAxios.mockResponseFor({ url, method: "post" });
            expect(thenFn).toHaveBeenCalled();
        });

        it("`mockResponseFor` should throw an error if no matching request can be found and !silentMode", () => {
            const url = "url";
            expect(() => MockAxios.mockResponseFor({ url, method: "post" })).toThrowError(
                "No request to respond to!",
            );
        });

        it("`mockResponseFor` should not throw an error if no matching request can be found but silentMode", () => {
            const url = "url";
            const thenFn = jest.fn();
            MockAxios.post("otherurl").then(thenFn);
            expect(() => MockAxios.mockResponseFor({ url, method: "post" }, { data: {} }, true)).not.toThrow();
            expect(thenFn).not.toHaveBeenCalled();
        });
    });

    describe("mockError", () => {
        // mockError - Simulate an error in server request
        it("`mockError` should fail the given promise with the provided response", () => {
            const thenFn = jest.fn();
            const catchFn = jest.fn();
            const promise = MockAxios.post();
            promise.then(thenFn).catch(catchFn);

            const errorObj = { n: "this is an error" };

            MockAxios.mockError(errorObj, promise);
            expect(catchFn).toHaveBeenCalledWith(errorObj);
            expect(thenFn).not.toHaveBeenCalledWith(errorObj);
        });

        it("`mockError` should mark error as an axios error", () => {
            const thenFn = jest.fn();
            const catchFn = jest.fn();
            const promise = MockAxios.post();
            promise.then(thenFn).catch(catchFn);

            const errorObj = { n: "this is an error" };

            MockAxios.mockError(errorObj, promise);
            expect(MockAxios.isAxiosError(errorObj)).toBe(true)
        });

        it("`mockError` should remove the promise from the queue", () => {
            MockAxios.post();
            MockAxios.mockError();
            expect(MockAxios.popPromise()).toBeUndefined();
        });

        it("`mockError` fail the provided promise", () => {
            const firstFn = jest.fn();
            const secondFn = jest.fn();
            const thirdFn = jest.fn();

            MockAxios.post().catch(firstFn);
            const secondPromise = MockAxios.post();
            secondPromise.catch(secondFn);
            MockAxios.post().catch(thirdFn);

            MockAxios.mockError({}, secondPromise);

            expect(firstFn).not.toHaveBeenCalled();
            expect(secondFn).toHaveBeenCalled();
            expect(thirdFn).not.toHaveBeenCalled();
        });

        it("`mockError` should fail the last given promise if none was provided", () => {
            const firstPromise = MockAxios.post();
            const secondPromise = MockAxios.post();
            const thirdPromise = MockAxios.post();

            const firstFn = jest.fn();
            const secondFn = jest.fn();
            const thirdFn = jest.fn();

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

        it("`mockError` should throw a specific error if no request can be resolved", () => {
            expect(() => MockAxios.mockError()).toThrowError(
                "No request to respond to!",
            );
        });

        it("`mockError` should not throw a specific error if no request can be resolved but silentMode is true", () => {
            expect(() =>
                MockAxios.mockError(undefined, undefined, true),
            ).not.toThrow();
        });

        it("`mockError` should pass down the error object", () => {
            class CustomError extends Error { }
            const promise = MockAxios.post();
            const catchFn = jest.fn();
            promise.catch(catchFn);

            MockAxios.mockError(new CustomError("custom error"));

            expect(catchFn).toHaveBeenCalled();
            expect(catchFn.mock.calls[0][0]).toBeInstanceOf(CustomError);
        });
    });

    // lastReqGet - returns the most recent request
    it("`lastReqGet` should return the most recent request", () => {
        MockAxios.post();
        const lastPromise = MockAxios.post();

        expect(MockAxios.lastReqGet().promise).toBe(lastPromise);
    });

    it("`lastReqGet` should contain config as passed to axios", () => {
        const method = "post";
        const url = "url";
        const data = { data: "data" };
        const config = { config: "config" };
        const promise = MockAxios.post("url", data, config);
        const lastReq = MockAxios.lastReqGet();

        expect(lastReq).toEqual({
            config: {
                ...config,
                data,
                method,
                url,
            },
            data,
            method,
            promise,
            url,
        });
    });

    // lastPromiseGet - Returns promise of the most recent request
    it("`lastPromiseGet` should return the most recent promise", () => {
        MockAxios.post();
        const lastPromise = MockAxios.post();

        expect(MockAxios.lastPromiseGet()).toBe(lastPromise);
    });

    describe("getReqMatching", () => {

        it("`getReqMatching` should return the most recent request matching the criteria", () => {
            const url = "url";
            MockAxios.delete(url);
            const promise = MockAxios.delete(url);
            MockAxios.get(url);

            expect(MockAxios.getReqMatching({ url, method: "delete" }).promise).toBe(promise);
        });

        it("`getReqMatching` should return undefined if no matching request can be found", () => {
            const url = "url";
            MockAxios.post();

            expect(MockAxios.getReqMatching({ url })).toBeUndefined();
        });

        it("`getReqMatching` should match when params match ", () => {
            const url = "url";
            MockAxios.get(url, { params: { a: "b", c: "d" } });

            const matchingReq = MockAxios.getReqMatching({ params: { a: "b" } });
            expect(matchingReq).toBeDefined();
            expect(matchingReq.url).toEqual(url);
        });

        it("`getReqMatching` should not match when params do not match", () => {
            const url = "url";
            MockAxios.get(url, { params: { a: "b", c: "d" } });

            const matchingReq = MockAxios.getReqMatching({ params: { a: "b", e: "f" } });
            expect(matchingReq).toBeUndefined();
        });

        it("`getReqMatching` should not match when there are no params", () => {
            const url = "url";
            MockAxios.get(url);

            const matchingReq = MockAxios.getReqMatching({ params: { a: "b" } });
            expect(matchingReq).toBeUndefined();
        });
    });

    it("`getReqByUrl` should return the most recent request matching the url", () => {
        const url = "url";
        MockAxios.post(url);
        const lastPromise = MockAxios.post(url);

        expect(MockAxios.getReqByUrl(url).promise).toBe(lastPromise);
    });

    it("`getReqByUrl` should return undefined if no matching request can be found", () => {
        const url = "url";
        MockAxios.post();

        expect(MockAxios.getReqByUrl(url)).toBeUndefined();
    });

    // popPromise - Removes the give promise from the queue
    it("`popPromise` should remove the given promise from the queue", () => {
        const firstPromise = MockAxios.post();
        const secondPromise = MockAxios.post();
        const thirdPromise = MockAxios.post();

        expect(MockAxios.popPromise(firstPromise)).toBe(firstPromise);
        expect(MockAxios.popPromise(thirdPromise)).toBe(thirdPromise);
        expect(MockAxios.popPromise(secondPromise)).toBe(secondPromise);

        // queue should be empty
        expect(MockAxios.lastPromiseGet()).toBeUndefined();
    });

    // popPromise - Removes the give promise from the queue
    it("`popRequest` should remove the given request from the queue", () => {
        MockAxios.post();
        const firstReq = MockAxios.lastReqGet();
        MockAxios.post();
        const secondReq = MockAxios.lastReqGet();
        MockAxios.post();
        const thirdReq = MockAxios.lastReqGet();

        expect(MockAxios.popRequest(firstReq)).toBe(firstReq);
        expect(MockAxios.popRequest(thirdReq)).toBe(thirdReq);
        expect(MockAxios.popRequest(secondReq)).toBe(secondReq);

        // queue should be empty
        expect(MockAxios.lastReqGet()).toBeUndefined();
    });

    // reset - Clears all of the queued requests
    it("`reset` should clear all the queued requests", () => {
        MockAxios.post();
        MockAxios.post();

        MockAxios.reset();
        MockAxios.reset();

        expect(MockAxios.lastReqGet()).toBeUndefined();
    });

    it("`reset` should clear clear all the spy statistics", () => {
        MockAxios.post();
        MockAxios.get();
        MockAxios.put();
        MockAxios.patch();
        MockAxios.delete();
        MockAxios.request();
        MockAxios.all([]);
        MockAxios.head();
        MockAxios.options();

        expect(MockAxios.post).toHaveBeenCalled();
        expect(MockAxios.get).toHaveBeenCalled();
        expect(MockAxios.put).toHaveBeenCalled();
        expect(MockAxios.patch).toHaveBeenCalled();
        expect(MockAxios.delete).toHaveBeenCalled();
        expect(MockAxios.request).toHaveBeenCalled();
        expect(MockAxios.all).toHaveBeenCalled();
        expect(MockAxios.head).toHaveBeenCalled();
        expect(MockAxios.options).toHaveBeenCalled();

        MockAxios.reset();

        expect(MockAxios.post).not.toHaveBeenCalled();
        expect(MockAxios.get).not.toHaveBeenCalled();
        expect(MockAxios.put).not.toHaveBeenCalled();
        expect(MockAxios.patch).not.toHaveBeenCalled();
        expect(MockAxios.delete).not.toHaveBeenCalled();
        expect(MockAxios.request).not.toHaveBeenCalled();
        expect(MockAxios.all).not.toHaveBeenCalled();
        expect(MockAxios.head).not.toHaveBeenCalled();
        expect(MockAxios.options).not.toHaveBeenCalled();
    });

    // queue - return the queue list
    it("`queue` should return the queued requests", () => {
        MockAxios.post();
        const firstReq = MockAxios.lastReqGet();
        MockAxios.post();
        const secondReq = MockAxios.lastReqGet();

        expect(MockAxios.queue()).toStrictEqual([firstReq, secondReq]);
    });

    // getReqByMatchUrl - return the most recent request matching the regex
    it("`getReqByMatchUrl` should return the queued request with a matching regex url", () => {
        const url = "right_url";
        MockAxios.post(url);
        const firstReq = MockAxios.lastReqGet();
        MockAxios.post("wrong_url");

        expect(MockAxios.getReqByMatchUrl(new RegExp('right'))).toStrictEqual(firstReq);
    });

    // getReqByRegex - return the most recent request matching any key with the regex (e.g.: url, data, config)
    describe("with `getReqByRegex`", () => {
        let firstReq;
        let deleteReq;

        beforeEach(() => {
            const url = "right_url";
            const data = { data: "my_data_value" };
            const config = { config: "my_config_value" };
            MockAxios.post(url, data, config);
            firstReq = MockAxios.lastReqGet();

            MockAxios.post("wrong_url");

            MockAxios.delete("wrong_url");
            deleteReq = MockAxios.lastReqGet();
        })

        it("should return the request matching url", () => {
            expect(MockAxios.getReqByRegex({ url: new RegExp('right') })).toStrictEqual(firstReq);
        });

        it("should return the request matching data", () => {
            expect(MockAxios.getReqByRegex({ data: new RegExp('my_data') })).toStrictEqual(firstReq);
        });

        it("should return the request matching config", () => {
            expect(MockAxios.getReqByRegex({ config: new RegExp('my_config') })).toStrictEqual(firstReq);
        });

        it("should return the request matching method", () => {
            expect(MockAxios.getReqByRegex({ method: new RegExp('delete') })).toStrictEqual(deleteReq);
        });

        it("should return the request matching url and data", () => {
            expect(MockAxios.getReqByRegex({ url: new RegExp('right'), data: new RegExp('my_data') })).toStrictEqual(firstReq);
        });

        it("should return undefined matching unexistent value", () => {
            expect(MockAxios.getReqByRegex({ url: new RegExp('undefined') })).toBeUndefined();
        });
    })

    describe("provides cancel interfaces", () => {
        it("provides axios.Cancel", () => {
            expect(MockAxios).toHaveProperty("Cancel");
            const cancel = new MockAxios.Cancel();
            expect(cancel).toHaveProperty("__CANCEL__");
            expect(cancel.toString()).toEqual("Cancel");
        });

        it("provides axios.isCancel", () => {
            expect(MockAxios).toHaveProperty("isCancel");
            expect(MockAxios.isCancel({})).toEqual(false);
            expect(MockAxios.isCancel(new MockAxios.Cancel())).toEqual(true);
        });

        it("provides axios.CancelToken", () => {
            expect(MockAxios).toHaveProperty("CancelToken");
            const CancelTokenClass = MockAxios.CancelToken;
            const cancelToken = CancelTokenClass.source();
            expect(cancelToken).toHaveProperty("cancel");
            expect(cancelToken).toHaveProperty("token");

            expect(cancelToken.token).toBeInstanceOf(MockAxios.CancelToken);
            expect(() => cancelToken.token.throwIfRequested()).not.toThrow();
            expect(() => cancelToken.cancel()).not.toThrow();
            expect(() => cancelToken.token.throwIfRequested()).toThrow();
        });
    });
});
