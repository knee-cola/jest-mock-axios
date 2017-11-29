# What's this?
This is a light-weight, easy to use synchronous [Axios](https://github.com/axios/axios) mock for unit testing with [Jest](https://facebook.github.io/jest/).

## Why would I use it?
Because it works synchronously, meaning that your tests will be easier to write, read and understand.

## Can it be used with Jasmine/Mocha?
Unfortunately *out of the box* this mock works only with [Jest](https://facebook.github.io/jest/).

However, if you look at the [source code](https://github.com/knee-cola/jest-mock-axios/blob/master/lib/mock-axios.ts), you can see that it uses Jest only to define spies (for methods `post`, `get`, `put`, `delete`). This means that it can easily be modified to use any other testing framework - go to [GitHub](https://github.com/knee-cola/jest-mock-axios), clone it, modify it, play with it :)

# What's in this document?
* [Installation](#installation)
  * [Why do we need to manually create the mock?](#why-do-we-need-to-manually-create-the-mock)
* [Basic example](#basic-example)
* [Axios mock API](#axios-mock-api)
  * [axios.mockResponse(response, promise)](#axiosmockresponseresponse-promise)
  * [axios.mockError(err, promise)](#axiosmockerrorerr-promise)
  * [axios.lastReqGet()](#axioslastreqget)
  * [axios.reset()](#axiosreset)
* [Additional examples](#additional-examples)
  * [Using `lastReqGet` method](#using-lastreqget-method)
* [Synchronous promise](#synchronous-promise)

# Installation
Installation is simple - just run:

    npm i --save-dev jest-mock-axios

Next you need to setup a [manual Jest mock](https://facebook.github.io/jest/docs/en/manual-mocks.html) for *Axios* (we'll explain why a bit later):
* create `__mocks__` directory in your project root
* inside this new directory create a files named `axios.js`
* copy & past the following snippets to `axios.js` file

```javascript
// ./__mock__/axios.js
import mockAxios from 'jest-mock-axios';
export default mockAxios;
```

## Why do we need to manually create the mock?
It's because Jest expects mocks to be placed in the project root, while
packages installed via NPM get stored inside `node_modules` subdirectory.

# Basic example
Let's consider that we want to test a component which uses Axios. This component returns a promise, which will be resolved after Axios is done communicating with the server.

Here's a Jest snippet, which explains how we would test this component:
```javascript
// ./src/__tests__/UppercaseProxy.spec.js
import mockAxios from 'jest-mock-axios';

afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
});

it('UppercaseProxy should get data from the server and convert it to UPPERCASE', () => {

    let catchFn = jest.fn(),
        thenFn = jest.fn();

    // using the component, which should make a server response
    UppercaseProxy('client is saying hello!')
        .then(thenFn)
        .catch(catchFn);

    // simulating a server response
    mockAxios.mockResponse({ data: 'server says hello!' });

    // since `post` method is a spy, we can check if the server request was correct
    // a) the correct method was used (post)
    // b) went to the correct web service URL ('/web-service-url/')
    // c) if the payload was correct ('client is saying hello!')
    expect(mockAxios.post).toHaveBeenCalledWith('/web-service-url/', 'client is saying hello!' );

    // checking the `then` spy has been called and if the
    // response from the server was converted to upper case
    expect(thenFn).toHaveBeenCalledWith('SERVER SAYS HELLO!');

    // catch should not have been called
    expect(catchFn).not.toHaveBeenCalled();
});
```

To make this example complete and easier to understand, let's have a look at a (verbose) implementation of component we are testing:
```javascript
// ./src/UppercaseProxy.js
import axios from 'axios';

const UppercaseProxy = (clientMessage) => {

    // requesting data from server
    let axiosPromise = axios.post('/web-service-url/', { data: clientMessage });

    // converting server response to upper case
    axiosPromise = axiosPromise.then(serverData => serverData.toUpper());

    // returning promise so that client code can attach `then` and `catch` handler
    return(axiosPromise);
};

export default UppercaseProxy;
```

At the bottom of this page you can find additional examples.

# Axios mock API
In addition to standard Axios methods (get, post, put, delete), which are exposed as spies, Axios mock has three additional public methods, which are intended to facilitate mocking:
* `mockResponse` - simulates a server (web service) response
* `mockError` - simulates a (network/server) error 
* `lastReqGet` - returns a last promise which was given (useful if multiple Axios requests are made within a single `it` block)
* `reset` - reset the Axios mock - prepare it for the next test (typically used in `afterEach`)

## axios.mockResponse(response, promise)
After a request request has been made to the server (web service), this method resolves that request by simulating a server response.

### Arguments: `response`
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

### Arguments: `promise`
The second argument is a promise, which was given when the server request was made. This argument is also optional - it defaults to the promise made when the last server request was made.

We can use it to pinpoint an exact server request we wish to resolve, which is useful only if we're making multiple server requests before calling `axios.reset`.

At the end of this document you can find an example which demonstrates how this parameter can be used.

## axios.mockError(err, promise)
This method simulates an error while making a server request (network error, server error, etc ...). It is in fact very similar to `mockResponse` method: it receives to optional parameters: error object and a promise.

### Arguments: `err`
Error object will get passed to `catch` event handler function. If omitted it defaults to an empty object.

### Arguments: `promise`
The second argument is a promise object, which works the same way as described part about the `mockResponse` method.

## axios.lastReqGet()
`lastReqGet` method returns a promise given when the most recent server request was made. We can use this method if we want to pass the promise object to `mockResponse` or `mockError` methods.

## axios.reset()
`reset` method clears state of the Axios mock to initial values. It should be called after each test, so that we can start fresh with our next test (i.e. from `afterEach` method).

# Additional examples
Since this is a simple mock, most of the functionality was covered in basic test, at the begining of this page. In this section we'll explore features not covered by that initial example.

## Using `lastReqGet` method
In the following example we'll have a look at use case for the `lastReqGet` method. In this example we'll create two consecutive requests before simulating a server response to the first.

```javascript
it('when resolving a request it should call the appropriate handler', () => {

    let thenFn1 = jest.fn(),
        thenFn2 = jest.fn();
    
    // creating the first server request
    UppercaseProxy('client is saying hello!').then(thenFn1);
    let firstReqPromise = mockAxios.lastReqGet();

    // creating the second server request
    // BEFORE the first had chance to be resolved
    UppercaseProxy('client says bye bye!').then(thenFn2);

    // simulating a server response to the FIRST request
    mockAxios.mockResponse({ data: 'server says hello!' }, firstReqPromise);

    // only the first handler should have been called
    expect(thenFn1).toHaveBeenCalled();
    expect(thenFn2).not.toHaveBeenCalled();

    // simulating a server response to the SECOND request
    // NOTE: here we don't need to provide the request object,
    //       since we want to reolve the request which was made last
    mockAxios.mockResponse({ data: 'server says bye bye!' });

    // the first `then` handles should be called only once
    expect(thenFn1).toHaveBeenCalledTimes(1);
    // now the second `then` handler should be called
    expect(thenFn2).toHaveBeenCalled();
});
```
Although this might not be the most realistic use-case of this functionality, It's good enough to illustrate how `lastReqGet` method can be used.

# Synchronous promise
Tha magic which enables axio mock to work synchronously is hidden away in [`jest-mock-promise`](https://www.npmjs.com/package/jest-mock-promise), which enables promises to be settled in synchronous manner.

The [`jest-mock-promise`](https://www.npmjs.com/package/jest-mock-promise) can be used to mock any asyc component which uses promises.

# Inspiration
This mock is loosely based on the following gist: [tux4/axios-test.js](https://gist.github.com/tux4/36006a1859323f779ab0)

# License
MIT License, [http://www.opensource.org/licenses/MIT](http://www.opensource.org/licenses/MIT)