(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jest-mock-axios"] = factory();
	else
		root["jest-mock-axios"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jest_mock_promise__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jest_mock_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jest_mock_promise__);
/**
 * TypeScript version of Axios mock for unoit testing with [Jest](https://facebook.github.io/jest/).
 * This file is based on https://gist.github.com/tux4/36006a1859323f779ab0
 *
 * @author   knee-cola <nikola.derezic@gmail.com>
 * @license  @license MIT License, http://www.opensource.org/licenses/MIT
 */

class JestMockAxios {
    constructor() {
        /** a FIFO queue of pending request */
        this.pending_promises = [];
        // mocking Axios methods
        this.get = jest.fn(this.newReq.bind(this));
        this.post = jest.fn(this.newReq.bind(this));
        this.put = jest.fn(this.newReq.bind(this));
        this.delete = jest.fn(this.newReq.bind(this));
    }
    newReq() {
        let promise = new __WEBPACK_IMPORTED_MODULE_0_jest_mock_promise___default.a();
        this.pending_promises.push(promise);
        return (promise);
    }
    /**
     * Removes the give promise from the queue
     * @param promise
     */
    popPromise(promise) {
        if (promise) {
            // remove the promise from pending queue
            this.pending_promises.splice(this.pending_promises.indexOf(promise), 1);
        }
        else {
            // take the oldest promise
            promise = this.pending_promises.shift();
        }
        return (promise);
    }
    /**
     * Simulate a server response, (optionally) with the given data
     * @param response (optional) response returned by the server
     * @param promise (optional) request promise for which response should be resolved
     */
    mockResponse(response, promise = null) {
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
    mockError(error = {}, promise = null) {
        // remove promise from the queue
        promise = this.popPromise(promise);
        // resolving the Promise with the given response data
        promise.reject(Object.assign({}, error));
    }
    /**
     * Returns promise of the most recent request
     */
    lastReqGet() {
        return (this.pending_promises[this.pending_promises.length - 1]);
    }
    /**
     * Clears all of the queued requests
     */
    reset() {
        this.pending_promises.splice(0, this.pending_promises.length);
        // resets all information stored in the mockFn.mock.calls and mockFn.mock.instances arrays
        this.get.mockClear();
        this.post.mockClear();
        this.put.mockClear();
        this.delete.mockClear();
    }
}
;
// this is a singletone object
/* harmony default export */ __webpack_exports__["default"] = (JestMockAxios);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jest-mock-promise"] = factory();
	else
		root["jest-mock-promise"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Synchronous Promise, which gets settled (resolved or settled) in a synchronous manner.
 *
 * `JestMockPromise` was written to simplify unit testing mocking (i.e. in [Jest](https://facebook.github.io/jest/) )
 *
 * In order to simplify synchronious promise settling two additional methods
 * were added to the promise instance:
 *   - `resolve` = forces the given promise to be resolved right away
 *   - `reject` = forces the given promise to be rejected right away
 *
 * By using these methods, we can write something like (provided that the Promise is mocked):
 *
 *    let promise = ExternalComponent.doAyncWork();
 *    promise.resolve({ label: 'this is some mock data' });
 *
 * @author   knee-cola<nikola.derezic@gmail.com>
 * @license  @license MIT License, http://www.opensource.org/licenses/MIT
 *
 */
var PromiseState;
(function (PromiseState) {
    PromiseState[PromiseState["pending"] = 0] = "pending";
    PromiseState[PromiseState["resolved"] = 1] = "resolved";
    PromiseState[PromiseState["rejected"] = 2] = "rejected";
})(PromiseState || (PromiseState = {}));

var JestMockPromise = function () {
    function JestMockPromise(callbackFn) {
        _classCallCheck(this, JestMockPromise);

        this.handlers = [];
        this.handlerIx = 0;
        this.state = PromiseState.pending;
        // if given, calling the given function
        if (callbackFn) {
            callbackFn(this.resolveFn.bind(this), this.rejectFn.bind(this));
        }
    }
    /**
     * Resolves the given promise
     * @param data data which should be passed to `then` handler functions
     */


    _createClass(JestMockPromise, [{
        key: "resolveFn",
        value: function resolveFn(data) {
            this.data = data;
            this.state = PromiseState.resolved;
            this.err = void 0;
            for (var maxIx = this.handlers.length; this.handlerIx < maxIx; this.handlerIx++) {
                var el = this.handlers[this.handlerIx];
                var returnedValue;
                // stop the execution at first `catch` handler you run into
                if (el.catch) {
                    break;
                }
                try {
                    // calling a `then` handler
                    returnedValue = el.then(this.data);
                } catch (ex) {
                    // in case `then` handler throws an error
                    // > pass it down to a first `catch` handler
                    this.handlerIx++;
                    this.rejectFn(ex);
                }
                if (returnedValue !== void 0) {
                    // IF handler returned a value
                    // > use it as the `data` for all the handlers which will be called next
                    this.data = returnedValue;
                }
            }
            ;
        }
    }, {
        key: "rejectFn",

        /**
         * Rejects the given promise
         * @param err error object which is to be passed as a param to `catch` function
         */
        value: function rejectFn(err) {
            this.state = PromiseState.rejected;
            this.err = err;
            // find the first `catch` handler and call it
            for (var maxIx = this.handlers.length; this.handlerIx < maxIx; this.handlerIx++) {
                var el = this.handlers[this.handlerIx],
                    returnedValue;
                if (el.catch) {
                    returnedValue = el.catch(err);
                    // try executing `then` handlers which follow
                    this.handlerIx++;
                    this.resolveFn(returnedValue);
                    // stop the execution as soon as you run into a first catch element
                    break;
                }
            }
            ;
        }
        /**
         * Appends fulfillment and rejection handlers to the promise,
         * and returns a new promise resolving to the return value of
         * the called handler, or to its original settled value if the
         * promise was not handled (i.e. if the relevant handler
         * onFulfilled or onRejected is not a function).
         * @param onFulfilled fulfillment handler function
         * @param onRejected rejection handler function
         */

    }, {
        key: "then",
        value: function then(onFulfilled, onRejected) {
            // if the promise is already settled (resolved or rejected)
            // > call the apropriate handler
            switch (this.state) {
                case PromiseState.rejected:
                    if (onRejected) {
                        onRejected(this.err);
                    }
                    break;
                case PromiseState.resolved:
                    onFulfilled(this.data);
                    break;
                default:
                    this.handlers.push({ then: onFulfilled });
                    if (onRejected) {
                        this.handlers.push({ catch: onRejected });
                    }
            }
            return this;
        }
        /**
         * Appends a rejection handler callback to the promise,
         * and returns a new promise resolving to the return
         * value of the callback if it is called, or to its
         * original fulfillment value if the promise is instead
         * fulfilled.
         * @param onRejected rejection handler function
         */

    }, {
        key: "catch",
        value: function _catch(onRejected) {
            // if the promise is already rejected
            // > call the handler right away
            if (this.state === PromiseState.resolved) {
                onRejected(this.err);
            } else {
                this.handlers.push({ catch: onRejected });
            }
            return this;
        }
        /**
         * Resolves the promise with the given promise data.
         * This is a non-standard method, which should be the last
         * one to be called, after all the fulfillment and rejection
         * handlers have been registered.
         * @param {*} data
         */

    }, {
        key: "resolve",
        value: function resolve(data) {
            this.resolveFn(data);
        }
        /**
         * Rejects the promise with the given promise with the given error object.
         * This is a non-standard method, which should be the last
         * one to be called, after all the fulfillment and rejection
         * handlers have been registered.
         * @param {*} data
         */

    }, {
        key: "reject",
        value: function reject(err) {
            this.rejectFn(err);
        }
        /**
         * Creates a resolved promise with the given data
         * @param data data which should be passed to `then` handler functions
         */

    }], [{
        key: "resolve",
        value: function resolve(data) {
            console.warn('a promise created via `JestMockPromise.resolve` will be executed async ... for sync execution call `resolve` method on an instance of `Promise`');
            return new JestMockPromise(function (resolve, reject) {
                setTimeout(resolve(data), 0);
            });
        }
        /**
         * Creates a rejected promise with the given data
         * @param err error object which is to be passed as a param to `catch` function
         */

    }, {
        key: "reject",
        value: function reject(err) {
            console.warn('a promise created via `JestMockPromise.reject` will be executed async ... for sync execution call `reject` method on an instance of `Promise`');
            return new JestMockPromise(function (resolve, reject) {
                setTimeout(reject(err), 0);
            });
        }
    }]);

    return JestMockPromise;
}();

exports.default = JestMockPromise;

/***/ })
/******/ ]);
});
//# sourceMappingURL=jest-mock-promise.js.map

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map