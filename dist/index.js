(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jest-mock-promise"));
	else if(typeof define === 'function' && define.amd)
		define(["jest-mock-promise"], factory);
	else if(typeof exports === 'object')
		exports["jest-mock-axios"] = factory(require("jest-mock-promise"));
	else
		root["jest-mock-axios"] = factory(root["jest-mock-promise"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mock_axios__ = __webpack_require__(1);

/* harmony default export */ __webpack_exports__["default"] = (new __WEBPACK_IMPORTED_MODULE_0__mock_axios__["a" /* default */]());


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jest_mock_promise__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jest_mock_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jest_mock_promise__);
/**
 * TypeScript version of Axios mock for unoit testing with [Jest](https://facebook.github.io/jest/).
 * This file is based on https://gist.github.com/tux4/36006a1859323f779ab0
 *
 * @author   knee-cola <nikola.derezic@gmail.com>
 * @license  @license MIT License, http://www.opensource.org/licenses/MIT
 */

class MockAxios {
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
/* harmony default export */ __webpack_exports__["a"] = (MockAxios);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map