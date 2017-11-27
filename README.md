# What's this?

This is a TypeScript version of [Axios](https://github.com/axios/axios) mock for unit testing with [Jest](https://facebook.github.io/jest/).
This mock is based on https://gist.github.com/tux4/36006a1859323f779ab0.

# How to use it?

## Installation
First you need to install this module:

    npm i --save-dev jest-mock-axios

After it's installed create `__mocks__` directory in your project root. Inside this new directory create two files: `axios.js` and `es6-promise.js`. The following two snippets contain code which you need to paste into each of the two files:

**File:** `./__mock__/axios.js`
```javascript
import AxiosMock from 'jest-mock-axios';
export { AxiosMock as Promise };
```

**File:** `./__mock__/es6-promise.js`
```javascript
import JestMockPromise from 'jest-mock-promise';
export { JestMockPromise as Promise };
```

We have just created a manual Jest mock for *Axios* ans *es6-promise*, which is used by Axios. You can find out more about manual mocking in [Jest manual](https://facebook.github.io/jest/docs/en/manual-mocks.html).

# Using it in your tests - An example

Let's consider that we want to test a component which uses Axios. This component returns a promise, which will be resolved after Axios is done communicationg with the server.

Here's a Jest snippet, which explains how we would test this component:
```javascript
it('UppercaseProxy should get data from the server and convert it to UPPERCASE', () => {

    let catchFn = jest.fn(),
        thenFn = jest.fn();

    UppercaseProxy('client is saying hello!')
        .then(catchFn)
        .catch(catchFn);

    let serverData = 'server says hello!';

    // simulating that the server has responded
    axios.mockResponse({ data: serverData });

    // just checking that Axios was used
    expect(axios.post).toHaveBeenCalled();

    let dataReceived:any = thenFn.mock.calls[0][0];

    // checking if the test was converted to uppercase
    expect(dataReceived).toEqual('SERVER SAYS HELLO!');
});
```

## Axios mock API

In addition to standard Axios methods (get, post, put, delete), which are exposed as spyes, Axios mock has three additional public methods, which are intended to facilitate mocking:
* `mockResponse` - simulates a server (web service) response
* `mockError` - simulates a (network/server) error 
* `lastReqGet` - returns a last promise which was given (usefull if multiple Axios requests are made within a single `it` block)
* `reset` - reset the Axios mock - prepare it for the next test (typically used in `afterEach`)

### axios.mockResponse

After a request request has been made to the server (web service), this method resolves that request by simulating a server response.

The first argument of this method is the a **response object** returned by the server, with a structure illustrated by the snippet below. Each of the properties is optional, meaning that if missing it will be replaced by the a default value (defaults are shown in the snippet).
```javascript
response = {
    data: {},
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
}
```
The given response object will get passed to `then` even handler function.

The second argument is a promise, which was given when the server request was made. This option is also optional - it defaults to the promise made when the last server request was made.

We can use it to pinpoint an exact server request we wish to resolve, which is usefull only if we're making multiple server requests before calling `axios.reset`.

### axios.mockError

This method simulates an error while making a server request (network error, server error, etc ...). It is in fact very similar to `mockResponse` method: it receives to optional parameters: error object and a promise.

Error object will get passed to `catch` event handler function. If ommited it defaults to an empty object.

The second argument is a promise object, which has the same function as the one in the `mockResponse` method.

### axios.lastReqGet

`lastReqGet` method returns a promise given when the most recent server request was made. We can use this method if we want to pass the promise object to `mockResponse` or `mockError` methods.

### axios.reset

`reset` method clears state of the Axios mock to initial values. It should be called after each test, so that we can start fresh with our next test (i.e. from `afterEach` method).

# License

MIT License, [http://www.opensource.org/licenses/MIT](http://www.opensource.org/licenses/MIT)