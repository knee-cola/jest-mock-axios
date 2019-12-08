# What's this?
This is a light-weight, easy to use synchronous [Axios](https://github.com/axios/axios) mock for unit testing with [Jest](https://facebook.github.io/jest/).

## Why would I use it?
Because it works synchronously, meaning that your tests will be easier to write, read and understand.

## Can it be used with Jasmine/Mocha?
Unfortunately *out of the box* this mock works only with [Jest](https://facebook.github.io/jest/).

However, if you look at the [source code](https://github.com/knee-cola/jest-mock-axios/blob/master/lib/mock-axios.ts), you can see that it uses Jest only to define spies (for methods `post`, `get`, `put`, `patch`, `delete`, `create`, `all`, `head`, `options`, `request`). This means that it can easily be modified to use any other testing framework - go to [GitHub](https://github.com/knee-cola/jest-mock-axios), clone it, modify it, play with it :)

# What's in this document?
* [Installation](#installation)
  * [Why do we need to manually create the mock?](#why-do-we-need-to-manually-create-the-mock)
* [Basic example](#basic-example)
* [Axios mock API](#axios-mock-api)
  * [axios.mockResponse](#axiosmockresponseresponse-requestinfo-silentmode)
  * [axios.mockResponseFor](#axiosmockresponseforcriteria-response-silentmode)
  * [axios.mockError](#axiosmockerrorerr-requestinfo)
  * [axios.lastReqGet](#axioslastreqget)
  * [axios.lastPromiseGet](#axioslastpromiseget)
  * [axios.reset](#axiosreset)
* [Additional examples](#additional-examples)
  * [Values returned by `lastReqGet` and `lastPromiseGet` methods](#values-returned-by-lastreqget-and-lastpromiseget-methods)
  * [Resolving requests out of order](#resolving-requests-out-of-order)
* [Missing features](#missing-features)
* [Synchronous promise](#synchronous-promise)

# Installation
Installation is simple - just run:

    npm i --save-dev jest-mock-axios

Next you need to setup a [manual Jest mock](https://facebook.github.io/jest/docs/en/manual-mocks.html) for *Axios* (we'll explain why a bit later):
* create `__mocks__` directory in your project root
* inside this new directory create a files named `axios.js`
* copy & past the following snippets to `axios.js` file

```javascript
// ./__mocks__/axios.js
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
// ./test/UppercaseProxy.spec.js
import mockAxios from 'jest-mock-axios';
import UppercaseProxy from '../src/UppercaseProxy';

afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
});

it('UppercaseProxy should get data from the server and convert it to UPPERCASE', () => {

    let catchFn = jest.fn(),
        thenFn = jest.fn();

    // using the component, which should make a server response
    let clientMessage = 'client is saying hello!';

    UppercaseProxy(clientMessage)
        .then(thenFn)
        .catch(catchFn);

    // since `post` method is a spy, we can check if the server request was correct
    // a) the correct method was used (post)
    // b) went to the correct web service URL ('/web-service-url/')
    // c) if the payload was correct ('client is saying hello!')
    expect(mockAxios.post).toHaveBeenCalledWith('/web-service-url/', {data: clientMessage });

    // simulating a server response
    let responseObj = { data: 'server says hello!' };
    mockAxios.mockResponse(responseObj);

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
    axiosPromise = axiosPromise.then(serverData => serverData.data.toUpperCase());

    // returning promise so that client code can attach `then` and `catch` handler
    return(axiosPromise);
};

export default UppercaseProxy;
```

At the bottom of this page you can find [additional examples](#additional-examples).

# Axios mock API
In addition to standard Axios methods (`post`, `get`, `put`, `patch`, `delete`, `create`, `all`, `head`, `options`, `request`), which are exposed as spies, Axios mock has three additional public methods, which are intended to facilitate mocking:
* `mockResponse` - simulates a server (web service) response
* `mockError` - simulates a (network/server) error
* `lastReqGet` - returns extended info about the most recent request
* `lastPromiseGet` - returns promise created when the most recent request was made
* `reset` - resets the Axios mock object - prepare it for the next test (typically used in `afterEach`)

*Note: `all` is just an alias to Promise.all (as it is in axios). Thus you can use it with mockResponse, but you can still retrieve statistics for it. Mock the requests used in all instead.*

## axios.mockResponse(response[, requestInfo[, silentMode]])
After a request has been made to the server (web service), this method resolves that request by simulating a server response. Status meaning is ignored, i.e. `400` will still resolve `axios` promise. Use `mockError` for non-2xx responses.
**NOTE:** This method should be called _after_ the axios call in your test for the promise to resolve properly.

### Arguments: `response`
The first argument of this method is the a **response object** returned by the server, with a structure illustrated by the snippet below. All the properties are optional, meaning that if a property is ommitted it will be replaced by a default value (defaults are shown in the snippet).
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

### Arguments: (optional) `requestInfo`
The second argument enables us to pinpoint an exact server request we wish to resolve. This can be useful if we're making multiple server requests and are planing to resolve them in a different order from the one in which they were made.

We supply two different objects:
* an extended request info object, which can be accessed by calling `lastReqGet` method
* a `promise` object, which can be accessed by calling the `lastPromiseGet` method

If ommited this argument defaults to the latest request made (internally the `lastReqGet` method is called).

At the end of this document you can find [an example](#resolving-requests-out-of-order) which demonstrates how this parameter can be used.

### Arguments: (optional) `silentMode`
Both `mockResponse` and `mockError` will throw an error if you're trying to respond to no request, as this usually means you're doing something wrong.
You can change this behavior by passing `true` as third argument, activating the so-called `silentMode`. With `silentMode` activated, the methods will just do nothing.

## axios.mockResponseFor(criteria, response[, silentMode])
This behaves very similar to `mockResponse`, but you explicitly specify the request you want to respond to by
specifying an object containing `url` and/or `method`, or just a plain string (to match by URL only).

Example:
```js
mockAxios.mockResponseFor({url: '/get'}, {data: "test"});
```

### Arguments: `criteria`

An object or string (the url) specifying which request to match. Currently `url` and `method` are supported for the object. If both `url` and `method` are passed, it only responds to requests matching both. If multiple requests match against the criteria, the most recent one is responded to.

### Arguments: `response`
The second argument is a `response` object, which works the same way as described part about the `mockResponse` method.

### Arguments: (optional) `silentMode`
The third argument is the `silentMode` flag, which works the same way as described part about the `mockResponse` method.

## axios.mockError(err[, requestInfo])
This method simulates an error while making a server request (network error, server error, etc ...).
**NOTE:** This method should be called _after_ the axios call in your test for the promise to resolve properly.

### Arguments: `err`
Error object will get passed to `catch` event handler function. If omitted it defaults to an empty object.

### Arguments: (optional) `requestInfo`
The second argument is a `requestInfo` object, which works the same way as described part about the `mockResponse` method.

### Arguments: (optional) `silentMode`
The third argument is the `silentMode` flag, which works the same way as described part about the `mockResponse` method.

## axios.lastReqGet()
`lastReqGet` method returns extended info about the most recent request. The returned value can be used to pinpoint exact server request we wish to resolve (the value is passed as the second param of `mockResponse` or `mockError` methods).

The returned info contains all the data relevant to the request. It has the following structure (an example):
```javascript

let requestInfo = {
    // promise created while
    promise: SimplePromise,
    // URL passed to the get/post/head/delete method
    url: "https://github.com/",
    // data which was pased to the get/post/head/delete method
    data: { text: "this is payload sent to the server" },
    // config which was pased to the get/post/head/delete method
    config: {
        ... something ...
    }
}
```

[Additional examples](#additional-examples) at the end of this document illustrate how this method can be used.

**NOTE:** this is a sibling method to the `lastPromiseGet` (which returns only the promise portion of this the request object).

If no request has been made yet, returns `undefined`.

## axios.getReqMatching(criteria)

`getReqMatching()` returns the same info about a specific request as `lastReqGet` (see above). Instead of returning
the most recent request, it returns the most recent request matching the given criteria or `undefined` if no such request could be found.

### Arguments: `criteria`
An object specifying which request to match. Currently `url` and `method` are supported.

## axios.getReqByUrl(url)

`getReqByUrl()` returns the same info about a specific request as `lastReqGet` (see above). Instead of returning the
most recent request, it returns the most recent request matching the given url or `undefined` if no such request could be found.

### Arguments: `url`
The url to be matched. Must match exactly the url passed to axios before.

## axios.lastPromiseGet()
`lastPromiseGet` method returns a promise given when the most recent server request was made. The returned value can be used to pinpoint exact server request we wish to resolve (the value is passed as the second param of `mockResponse` or `mockError` methods).

The promise object returned by this function corresponds to the one returned by `post`, `get`, `put`, `patch`, `delete`, `head`, `options`, `request` or `all` method inside the code we wish to test.


[Additional examples](#additional-examples) at the end of this document illustrate how this method can be used.

**NOTE:** This is a sibling method to the `lastReqGet`, which in addition to promise returns object containing extended info about the request.

## axios.reset()
`reset` method clears state of the Axios mock to initial values. It should be called after each test, so that we can start fresh with our next test (i.e. from `afterEach` method).

# Additional examples
Since AxiosMock is relatively simple, most of its functionality was covered in [basic example](#basic-example) at the beginning of this document. In this section we'll explore features not covered by that initial example.

## Values returned by `lastReqGet` and `lastPromiseGet` methods

The following example illustrates the meaning of the values returned by `lastReqGet` and `lastPromiseGet` methods.

The first snippet shows a component which will be tested. The component makes a `post` request to the server and stores the promise returned by Axios.

```javascript
// ./src/MyComponent.js
import axios from '../lib/index';

class MyComponent {

    CallServer () {
        // making a `post` request and storing the given promise
        this.axiosPromise = axios.post('/web-service-url/', { data: clientMessage });
    }
}

export default MyComponent;
```
In our spec file we will compare promise stored inside the `MyComponent` with values returned by `lastReqGet` and `lastPromiseGet` methods:

```javascript
// ./test/MyComponent.spec.js
    import MyComponent from '../src/SomeSourceFile';

    let myComp = new MyComponent();

    myComp.CallServer();

    // getting the extended info about the most recent request
    let lastReqInfo = MockAxios.lastReqGet();
    // getting the promise made when the most recent request was made
    let lastPromise = MockAxios.lastPromiseGet();

    // the following expression will write `true` to the console
    // > here we compare promise stored in the `MyComponent` to the one
    //   returned by the `lastPromiseGet` method
    console.log(myComp.axiosPromise === lastPromise);

    // the following expression will also write `true` to the console
    // > here we compare promise stored in the `MyComponent`
    //   to the one in the request info, which was returned by the
    //   `lastReqGet` method
    console.log(myComp.axiosPromise === lastReqInfo.promise);

    // the following will also write "true" to console,
    // since it't the same object
    console.log(lastPromise ===  lastReqInfo.promise);
```

## Resolving requests out of order
In the following example we'll have a look at how to resolve requests at desired order by using [`lastReqGet`](#axioslastreqget) method.

In this example we'll create two consecutive requests before simulating a server response to the first one.

```javascript
it('when resolving a request an appropriate handler should be called', () => {

    let thenFn1 = jest.fn(),
        thenFn2 = jest.fn();

    // creating the FIRST server request
    UppercaseProxy('client is saying hello!').then(thenFn1);
    // storing the request info - we'll need it later to pinpoint the request
    let firstRequestInfo = mockAxios.lastReqGet();

    // creating the SECOND server request
    // BEFORE the first had chance to be resolved
    UppercaseProxy('client says bye bye!').then(thenFn2);

    // Simulating a server response to the FIRST request
    // -> we're using request info object to pinpoint the request
    // ... IF the info object is ommited, the method would automatically
    // resolve to the newest request from the internal queue (the SECOND one)
    mockAxios.mockResponse({ data: 'server says hello!' }, firstRequestInfo);

    // only the first handler should have been called
    expect(thenFn1).toHaveBeenCalled();
    expect(thenFn2).not.toHaveBeenCalled();

    // Simulating a server response to the SECOND request
    // NOTE: here we don't need to provide the request info,
    // since there is only one unresolved request left
    // -> `mockResponse` resolves the last request in the
    //     queue if request info is ommited
    mockAxios.mockResponse({ data: 'server says bye bye!' });

    // the first `then` handles should be called only once
    expect(thenFn1).toHaveBeenCalledTimes(1);
    // now the second `then` handler should be called
    expect(thenFn2).toHaveBeenCalled();
});
```
Although this might not be the most realistic use-case of this functionality, it does illustrate how `lastReqGet` method can be used to alter the default behaviour of the `mockResponse` method.

**NOTE:** the identical effect can be achieved by using the [`lastPromiseGet`](#axioslastpromiseget) method. These two methods perform a similar task, as described in the corresponding documentation.

## Interceptors

AxiosMock offers basic support for interceptors (i.e. it does not break when interceptors are used in tested code). However, interceptors are not applied to the mocked requests / responses at the moment.

# Missing features
AxiosMock covers the most popular parts of Axios API, meaning that some of the features are missing or only partially implemented (i.e. interceptors). AxiosMock provides the `axios.CancelToken` interface, but with an empty implementation.

If you need an additional feature, you can request it by creating a new issue on [project's GitHub page](https://github.com/knee-cola/jest-mock-axios/issues/).

Also you are welcome to implement the missing feature yourself and make a pull request :)

# Synchronous promise
The magic which enables axios mock to work synchronously is hidden away in [`synchronous-promise`](https://www.npmjs.com/package/synchronous-promise), which enables promises to be settled in synchronous manner.

# Inspiration
This mock is loosely based on the following gist: [tux4/axios-test.js](https://gist.github.com/tux4/36006a1859323f779ab0)

# License
MIT License, [http://www.opensource.org/licenses/MIT](http://www.opensource.org/licenses/MIT)
