import {afterEach, expect, it, jest} from '@jest/globals';

import mockAxios from "../lib/index";
import UppercaseProxy from "./UppercaseProxy";
import CancelToken from "../lib/cancel/CancelToken";

afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
});

it("UppercaseProxy should get data from the server and convert it to UPPERCASE", () => {
    const catchFn = jest.fn();
    const thenFn = jest.fn();

    // using the component, which should make a server response
    const clientMessage = "client is saying hello!";

    UppercaseProxy(clientMessage)
        .then(thenFn)
        .catch(catchFn);

    // since `post` method is a spy, we can check if the server request was correct
    // a) the correct method was used (post)
    // b) went to the correct web service URL ('/web-service-url/')
    // c) if the payload was correct ('client is saying hello!')
    expect(mockAxios.post).toHaveBeenCalledWith("/web-service-url/", {
        data: clientMessage,
        cancelToken: expect.any(CancelToken)
    });

    // simulating a server response
    const responseObj = { data: "server says hello!" };
    mockAxios.mockResponse(responseObj);

    // catch should not have been called
    expect(catchFn).not.toHaveBeenCalled();

    // checking the `then` spy has been called and if the
    // response from the server was converted to upper case
    expect(thenFn).toHaveBeenCalledWith("SERVER SAYS HELLO!");
});

it("UppercaseProxy should catch errors", () => {
    console.log = jest.fn();

    // using the component, which should make a server response
    const clientMessage = "client is saying hello!";

    UppercaseProxy(clientMessage);

    // simulating a server response
    const error = new Error("server says error!");
    mockAxios.mockError(error);

    // catch should have been called
    expect(console.log).toHaveBeenCalled();
});
