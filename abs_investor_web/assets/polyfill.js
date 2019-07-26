if(IS_IE){

    /*
    * ES6
    * */
    if (typeof Object.assign !== 'function') {
        Object.assign = _.assign;
    }
    if (!Object.entries) {
        Object.entries = function (obj) {
            var ownProps = Object.keys(obj), i = ownProps.length, resArray = new Array(i);
            while (i--) {
                resArray[i] = [ownProps[i], obj[ownProps[i]]];
            }
            return resArray;
        };
    }
    if (!String.prototype.startsWith) {
        Object.defineProperty(String.prototype, 'startsWith', {
            value: function(search, pos) {
                return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
            }
        });
    }
    if (!String.prototype.includes) {
        Object.defineProperty(String.prototype, 'includes', {
            value: function(search, start) {
                if (typeof start !== 'number') {
                    start = 0
                }

                if (start + search.length > this.length) {
                    return false
                } else {
                    return this.indexOf(search, start) !== -1
                }
            }
        })
    }


    (function () {


        /*
        * https://github.com/then/promise
        * */
        /*
        * promise
        * Copyright (c) 2014 Forbes Lindesay
        * */
        (function e(t, n, r) {
            function s(o, u) {
                if (!n[o]) {
                    if (!t[o]) {
                        var a = typeof require == "function" && require;
                        if (!u && a) return a(o, !0);
                        if (i) return i(o, !0);
                        var f = new Error("Cannot find module '" + o + "'");
                        throw f.code = "MODULE_NOT_FOUND", f;
                    }
                    var l = n[o] = {
                        exports: {}
                    };
                    t[o][0].call(l.exports, function(e) {
                        var n = t[o][1][e];
                        return s(n ? n : e);
                    }, l, l.exports, e, t, n, r);
                }
                return n[o].exports;
            }
            var i = typeof require == "function" && require;
            for (var o = 0; o < r.length; o++) s(r[o]);
            return s;
        })({
            1: [ function(require, module, exports) {
                var process = module.exports = {};
                process.nextTick = function() {
                    var canSetImmediate = typeof window !== "undefined" && window.setImmediate;
                    var canPost = typeof window !== "undefined" && window.postMessage && window.addEventListener;
                    if (canSetImmediate) {
                        return function(f) {
                            return window.setImmediate(f);
                        };
                    }
                    if (canPost) {
                        var queue = [];
                        window.addEventListener("message", function(ev) {
                            var source = ev.source;
                            if ((source === window || source === null) && ev.data === "process-tick") {
                                ev.stopPropagation();
                                if (queue.length > 0) {
                                    var fn = queue.shift();
                                    fn();
                                }
                            }
                        }, true);
                        return function nextTick(fn) {
                            queue.push(fn);
                            window.postMessage("process-tick", "*");
                        };
                    }
                    return function nextTick(fn) {
                        setTimeout(fn, 0);
                    };
                }();
                process.title = "browser";
                process.browser = true;
                process.env = {};
                process.argv = [];
                function noop() {}
                process.on = noop;
                process.addListener = noop;
                process.once = noop;
                process.off = noop;
                process.removeListener = noop;
                process.removeAllListeners = noop;
                process.emit = noop;
                process.binding = function(name) {
                    throw new Error("process.binding is not supported");
                };
                process.cwd = function() {
                    return "/";
                };
                process.chdir = function(dir) {
                    throw new Error("process.chdir is not supported");
                };
            }, {} ],
            2: [ function(require, module, exports) {
                "use strict";
                var asap = require("asap");
                module.exports = Promise;
                function Promise(fn) {
                    if (typeof this !== "object") throw new TypeError("Promises must be constructed via new");
                    if (typeof fn !== "function") throw new TypeError("not a function");
                    var state = null;
                    var value = null;
                    var deferreds = [];
                    var self = this;
                    this.then = function(onFulfilled, onRejected) {
                        return new self.constructor(function(resolve, reject) {
                            handle(new Handler(onFulfilled, onRejected, resolve, reject));
                        });
                    };
                    function handle(deferred) {
                        if (state === null) {
                            deferreds.push(deferred);
                            return;
                        }
                        asap(function() {
                            var cb = state ? deferred.onFulfilled : deferred.onRejected;
                            if (cb === null) {
                                (state ? deferred.resolve : deferred.reject)(value);
                                return;
                            }
                            var ret;
                            try {
                                ret = cb(value);
                            } catch (e) {
                                deferred.reject(e);
                                return;
                            }
                            deferred.resolve(ret);
                        });
                    }
                    function resolve(newValue) {
                        try {
                            if (newValue === self) throw new TypeError("A promise cannot be resolved with itself.");
                            if (newValue && (typeof newValue === "object" || typeof newValue === "function")) {
                                var then = newValue.then;
                                if (typeof then === "function") {
                                    doResolve(then.bind(newValue), resolve, reject);
                                    return;
                                }
                            }
                            state = true;
                            value = newValue;
                            finale();
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function reject(newValue) {
                        state = false;
                        value = newValue;
                        finale();
                    }
                    function finale() {
                        for (var i = 0, len = deferreds.length; i < len; i++) handle(deferreds[i]);
                        deferreds = null;
                    }
                    doResolve(fn, resolve, reject);
                }
                function Handler(onFulfilled, onRejected, resolve, reject) {
                    this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
                    this.onRejected = typeof onRejected === "function" ? onRejected : null;
                    this.resolve = resolve;
                    this.reject = reject;
                }
                function doResolve(fn, onFulfilled, onRejected) {
                    var done = false;
                    try {
                        fn(function(value) {
                            if (done) return;
                            done = true;
                            onFulfilled(value);
                        }, function(reason) {
                            if (done) return;
                            done = true;
                            onRejected(reason);
                        });
                    } catch (ex) {
                        if (done) return;
                        done = true;
                        onRejected(ex);
                    }
                }
            }, {
                asap: 4
            } ],
            3: [ function(require, module, exports) {
                "use strict";
                var Promise = require("./core.js");
                var asap = require("asap");
                module.exports = Promise;
                function ValuePromise(value) {
                    this.then = function(onFulfilled) {
                        if (typeof onFulfilled !== "function") return this;
                        return new Promise(function(resolve, reject) {
                            asap(function() {
                                try {
                                    resolve(onFulfilled(value));
                                } catch (ex) {
                                    reject(ex);
                                }
                            });
                        });
                    };
                }
                ValuePromise.prototype = Promise.prototype;
                var TRUE = new ValuePromise(true);
                var FALSE = new ValuePromise(false);
                var NULL = new ValuePromise(null);
                var UNDEFINED = new ValuePromise(undefined);
                var ZERO = new ValuePromise(0);
                var EMPTYSTRING = new ValuePromise("");
                Promise.resolve = function(value) {
                    if (value instanceof Promise) return value;
                    if (value === null) return NULL;
                    if (value === undefined) return UNDEFINED;
                    if (value === true) return TRUE;
                    if (value === false) return FALSE;
                    if (value === 0) return ZERO;
                    if (value === "") return EMPTYSTRING;
                    if (typeof value === "object" || typeof value === "function") {
                        try {
                            var then = value.then;
                            if (typeof then === "function") {
                                return new Promise(then.bind(value));
                            }
                        } catch (ex) {
                            return new Promise(function(resolve, reject) {
                                reject(ex);
                            });
                        }
                    }
                    return new ValuePromise(value);
                };
                Promise.all = function(arr) {
                    var args = Array.prototype.slice.call(arr);
                    return new Promise(function(resolve, reject) {
                        if (args.length === 0) return resolve([]);
                        var remaining = args.length;
                        function res(i, val) {
                            try {
                                if (val && (typeof val === "object" || typeof val === "function")) {
                                    var then = val.then;
                                    if (typeof then === "function") {
                                        then.call(val, function(val) {
                                            res(i, val);
                                        }, reject);
                                        return;
                                    }
                                }
                                args[i] = val;
                                if (--remaining === 0) {
                                    resolve(args);
                                }
                            } catch (ex) {
                                reject(ex);
                            }
                        }
                        for (var i = 0; i < args.length; i++) {
                            res(i, args[i]);
                        }
                    });
                };
                Promise.reject = function(value) {
                    return new Promise(function(resolve, reject) {
                        reject(value);
                    });
                };
                Promise.race = function(values) {
                    return new Promise(function(resolve, reject) {
                        values.forEach(function(value) {
                            Promise.resolve(value).then(resolve, reject);
                        });
                    });
                };
                Promise.prototype["catch"] = function(onRejected) {
                    return this.then(null, onRejected);
                };
            }, {
                "./core.js": 2,
                asap: 4
            } ],
            4: [ function(require, module, exports) {
                (function(process) {
                    var head = {
                        task: void 0,
                        next: null
                    };
                    var tail = head;
                    var flushing = false;
                    var requestFlush = void 0;
                    var isNodeJS = false;
                    function flush() {
                        while (head.next) {
                            head = head.next;
                            var task = head.task;
                            head.task = void 0;
                            var domain = head.domain;
                            if (domain) {
                                head.domain = void 0;
                                domain.enter();
                            }
                            try {
                                task();
                            } catch (e) {
                                if (isNodeJS) {
                                    if (domain) {
                                        domain.exit();
                                    }
                                    setTimeout(flush, 0);
                                    if (domain) {
                                        domain.enter();
                                    }
                                    throw e;
                                } else {
                                    setTimeout(function() {
                                        throw e;
                                    }, 0);
                                }
                            }
                            if (domain) {
                                domain.exit();
                            }
                        }
                        flushing = false;
                    }
                    if (typeof process !== "undefined" && process.nextTick) {
                        isNodeJS = true;
                        requestFlush = function() {
                            process.nextTick(flush);
                        };
                    } else if (typeof setImmediate === "function") {
                        if (typeof window !== "undefined") {
                            requestFlush = setImmediate.bind(window, flush);
                        } else {
                            requestFlush = function() {
                                setImmediate(flush);
                            };
                        }
                    } else if (typeof MessageChannel !== "undefined") {
                        var channel = new MessageChannel();
                        channel.port1.onmessage = flush;
                        requestFlush = function() {
                            channel.port2.postMessage(0);
                        };
                    } else {
                        requestFlush = function() {
                            setTimeout(flush, 0);
                        };
                    }
                    function asap(task) {
                        tail = tail.next = {
                            task: task,
                            domain: isNodeJS && process.domain,
                            next: null
                        };
                        if (!flushing) {
                            flushing = true;
                            requestFlush();
                        }
                    }
                    module.exports = asap;
                }).call(this, require("_process"));
            }, {
                _process: 1
            } ],
            5: [ function(require, module, exports) {
                if (typeof Promise.prototype.done !== "function") {
                    Promise.prototype.done = function(onFulfilled, onRejected) {
                        var self = arguments.length ? this.then.apply(this, arguments) : this;
                        self.then(null, function(err) {
                            setTimeout(function() {
                                throw err;
                            }, 0);
                        });
                    };
                }
            }, {} ],
            6: [ function(require, module, exports) {
                var asap = require("asap");
                if (typeof Promise === "undefined") {
                    window.Promise = require("./lib/core.js");
                    require("./lib/es6-extensions.js");
                }
                require("./polyfill-done.js");
            }, {
                "./lib/core.js": 2,
                "./lib/es6-extensions.js": 3,
                "./polyfill-done.js": 5,
                asap: 4
            } ]
        }, {}, [ 6 ]);

        /*
        * fetch
        * Copyright (c) 2014-2016 GitHub, Inc.
        * */
        (function (global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
                typeof define === 'function' && define.amd ? define(['exports'], factory) :
                    (factory((global.WHATWGFetch = {})));
        }(this, (function (exports) { 'use strict';

            var support = {
                searchParams: 'URLSearchParams' in self,
                iterable: 'Symbol' in self && 'iterator' in Symbol,
                blob:
                    'FileReader' in self &&
                    'Blob' in self &&
                    (function() {
                        try {
                            new Blob();
                            return true
                        } catch (e) {
                            return false
                        }
                    })(),
                formData: 'FormData' in self,
                arrayBuffer: 'ArrayBuffer' in self
            };

            function isDataView(obj) {
                return obj && DataView.prototype.isPrototypeOf(obj)
            }

            if (support.arrayBuffer) {
                var viewClasses = [
                    '[object Int8Array]',
                    '[object Uint8Array]',
                    '[object Uint8ClampedArray]',
                    '[object Int16Array]',
                    '[object Uint16Array]',
                    '[object Int32Array]',
                    '[object Uint32Array]',
                    '[object Float32Array]',
                    '[object Float64Array]'
                ];

                var isArrayBufferView =
                    ArrayBuffer.isView ||
                    function(obj) {
                        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
                    };
            }

            function normalizeName(name) {
                if (typeof name !== 'string') {
                    name = String(name);
                }
                if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
                    throw new TypeError('Invalid character in header field name')
                }
                return name.toLowerCase()
            }

            function normalizeValue(value) {
                if (typeof value !== 'string') {
                    value = String(value);
                }
                return value
            }

            // Build a destructive iterator for the value list
            function iteratorFor(items) {
                var iterator = {
                    next: function() {
                        var value = items.shift();
                        return {done: value === undefined, value: value}
                    }
                };

                if (support.iterable) {
                    iterator[Symbol.iterator] = function() {
                        return iterator
                    };
                }

                return iterator
            }

            function Headers(headers) {
                this.map = {};

                if (headers instanceof Headers) {
                    headers.forEach(function(value, name) {
                        this.append(name, value);
                    }, this);
                } else if (Array.isArray(headers)) {
                    headers.forEach(function(header) {
                        this.append(header[0], header[1]);
                    }, this);
                } else if (headers) {
                    Object.getOwnPropertyNames(headers).forEach(function(name) {
                        this.append(name, headers[name]);
                    }, this);
                }
            }

            Headers.prototype.append = function(name, value) {
                name = normalizeName(name);
                value = normalizeValue(value);
                var oldValue = this.map[name];
                this.map[name] = oldValue ? oldValue + ', ' + value : value;
            };

            Headers.prototype['delete'] = function(name) {
                delete this.map[normalizeName(name)];
            };

            Headers.prototype.get = function(name) {
                name = normalizeName(name);
                return this.has(name) ? this.map[name] : null
            };

            Headers.prototype.has = function(name) {
                return this.map.hasOwnProperty(normalizeName(name))
            };

            Headers.prototype.set = function(name, value) {
                this.map[normalizeName(name)] = normalizeValue(value);
            };

            Headers.prototype.forEach = function(callback, thisArg) {
                for (var name in this.map) {
                    if (this.map.hasOwnProperty(name)) {
                        callback.call(thisArg, this.map[name], name, this);
                    }
                }
            };

            Headers.prototype.keys = function() {
                var items = [];
                this.forEach(function(value, name) {
                    items.push(name);
                });
                return iteratorFor(items)
            };

            Headers.prototype.values = function() {
                var items = [];
                this.forEach(function(value) {
                    items.push(value);
                });
                return iteratorFor(items)
            };

            Headers.prototype.entries = function() {
                var items = [];
                this.forEach(function(value, name) {
                    items.push([name, value]);
                });
                return iteratorFor(items)
            };

            if (support.iterable) {
                Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
            }

            function consumed(body) {
                if (body.bodyUsed) {
                    return Promise.reject(new TypeError('Already read'))
                }
                body.bodyUsed = true;
            }

            function fileReaderReady(reader) {
                return new Promise(function(resolve, reject) {
                    reader.onload = function() {
                        resolve(reader.result);
                    };
                    reader.onerror = function() {
                        reject(reader.error);
                    };
                })
            }

            function readBlobAsArrayBuffer(blob) {
                var reader = new FileReader();
                var promise = fileReaderReady(reader);
                reader.readAsArrayBuffer(blob);
                return promise
            }

            function readBlobAsText(blob) {
                var reader = new FileReader();
                var promise = fileReaderReady(reader);
                reader.readAsText(blob);
                return promise
            }

            function readArrayBufferAsText(buf) {
                var view = new Uint8Array(buf);
                var chars = new Array(view.length);

                for (var i = 0; i < view.length; i++) {
                    chars[i] = String.fromCharCode(view[i]);
                }
                return chars.join('')
            }

            function bufferClone(buf) {
                if (buf.slice) {
                    return buf.slice(0)
                } else {
                    var view = new Uint8Array(buf.byteLength);
                    view.set(new Uint8Array(buf));
                    return view.buffer
                }
            }

            function Body() {
                this.bodyUsed = false;

                this._initBody = function(body) {
                    this._bodyInit = body;
                    if (!body) {
                        this._bodyText = '';
                    } else if (typeof body === 'string') {
                        this._bodyText = body;
                    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                        this._bodyBlob = body;
                    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                        this._bodyFormData = body;
                    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                        this._bodyText = body.toString();
                    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
                        this._bodyArrayBuffer = bufferClone(body.buffer);
                        // IE 10-11 can't handle a DataView body.
                        this._bodyInit = new Blob([this._bodyArrayBuffer]);
                    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
                        this._bodyArrayBuffer = bufferClone(body);
                    } else {
                        this._bodyText = body = Object.prototype.toString.call(body);
                    }

                    if (!this.headers.get('content-type')) {
                        if (typeof body === 'string') {
                            this.headers.set('content-type', 'text/plain;charset=UTF-8');
                        } else if (this._bodyBlob && this._bodyBlob.type) {
                            this.headers.set('content-type', this._bodyBlob.type);
                        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                            this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                        }
                    }
                };

                if (support.blob) {
                    this.blob = function() {
                        var rejected = consumed(this);
                        if (rejected) {
                            return rejected
                        }

                        if (this._bodyBlob) {
                            return Promise.resolve(this._bodyBlob)
                        } else if (this._bodyArrayBuffer) {
                            return Promise.resolve(new Blob([this._bodyArrayBuffer]))
                        } else if (this._bodyFormData) {
                            throw new Error('could not read FormData body as blob')
                        } else {
                            return Promise.resolve(new Blob([this._bodyText]))
                        }
                    };

                    this.arrayBuffer = function() {
                        if (this._bodyArrayBuffer) {
                            return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
                        } else {
                            return this.blob().then(readBlobAsArrayBuffer)
                        }
                    };
                }

                this.text = function() {
                    var rejected = consumed(this);
                    if (rejected) {
                        return rejected
                    }

                    if (this._bodyBlob) {
                        return readBlobAsText(this._bodyBlob)
                    } else if (this._bodyArrayBuffer) {
                        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
                    } else if (this._bodyFormData) {
                        throw new Error('could not read FormData body as text')
                    } else {
                        return Promise.resolve(this._bodyText)
                    }
                };

                if (support.formData) {
                    this.formData = function() {
                        return this.text().then(decode)
                    };
                }

                this.json = function() {
                    return this.text().then(JSON.parse)
                };

                return this
            }

            // HTTP methods whose capitalization should be normalized
            var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

            function normalizeMethod(method) {
                var upcased = method.toUpperCase();
                return methods.indexOf(upcased) > -1 ? upcased : method
            }

            function Request(input, options) {
                options = options || {};
                var body = options.body;

                if (input instanceof Request) {
                    if (input.bodyUsed) {
                        throw new TypeError('Already read')
                    }
                    this.url = input.url;
                    this.credentials = input.credentials;
                    if (!options.headers) {
                        this.headers = new Headers(input.headers);
                    }
                    this.method = input.method;
                    this.mode = input.mode;
                    this.signal = input.signal;
                    if (!body && input._bodyInit != null) {
                        body = input._bodyInit;
                        input.bodyUsed = true;
                    }
                } else {
                    this.url = String(input);
                }

                this.credentials = options.credentials || this.credentials || 'same-origin';
                if (options.headers || !this.headers) {
                    this.headers = new Headers(options.headers);
                }
                this.method = normalizeMethod(options.method || this.method || 'GET');
                this.mode = options.mode || this.mode || null;
                this.signal = options.signal || this.signal;
                this.referrer = null;

                if ((this.method === 'GET' || this.method === 'HEAD') && body) {
                    throw new TypeError('Body not allowed for GET or HEAD requests')
                }
                this._initBody(body);
            }

            Request.prototype.clone = function() {
                return new Request(this, {body: this._bodyInit})
            };

            function decode(body) {
                var form = new FormData();
                body
                    .trim()
                    .split('&')
                    .forEach(function(bytes) {
                        if (bytes) {
                            var split = bytes.split('=');
                            var name = split.shift().replace(/\+/g, ' ');
                            var value = split.join('=').replace(/\+/g, ' ');
                            form.append(decodeURIComponent(name), decodeURIComponent(value));
                        }
                    });
                return form
            }

            function parseHeaders(rawHeaders) {
                var headers = new Headers();
                // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
                // https://tools.ietf.org/html/rfc7230#section-3.2
                var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
                preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
                    var parts = line.split(':');
                    var key = parts.shift().trim();
                    if (key) {
                        var value = parts.join(':').trim();
                        headers.append(key, value);
                    }
                });
                return headers
            }

            Body.call(Request.prototype);

            function Response(bodyInit, options) {
                if (!options) {
                    options = {};
                }

                this.type = 'default';
                this.status = options.status === undefined ? 200 : options.status;
                this.ok = this.status >= 200 && this.status < 300;
                this.statusText = 'statusText' in options ? options.statusText : 'OK';
                this.headers = new Headers(options.headers);
                this.url = options.url || '';
                this._initBody(bodyInit);
            }

            Body.call(Response.prototype);

            Response.prototype.clone = function() {
                return new Response(this._bodyInit, {
                    status: this.status,
                    statusText: this.statusText,
                    headers: new Headers(this.headers),
                    url: this.url
                })
            };

            Response.error = function() {
                var response = new Response(null, {status: 0, statusText: ''});
                response.type = 'error';
                return response
            };

            var redirectStatuses = [301, 302, 303, 307, 308];

            Response.redirect = function(url, status) {
                if (redirectStatuses.indexOf(status) === -1) {
                    throw new RangeError('Invalid status code')
                }

                return new Response(null, {status: status, headers: {location: url}})
            };

            exports.DOMException = self.DOMException;
            try {
                new exports.DOMException();
            } catch (err) {
                exports.DOMException = function(message, name) {
                    this.message = message;
                    this.name = name;
                    var error = Error(message);
                    this.stack = error.stack;
                };
                exports.DOMException.prototype = Object.create(Error.prototype);
                exports.DOMException.prototype.constructor = exports.DOMException;
            }

            function fetch(input, init) {
                return new Promise(function(resolve, reject) {
                    var request = new Request(input, init);

                    if (request.signal && request.signal.aborted) {
                        return reject(new exports.DOMException('Aborted', 'AbortError'))
                    }

                    var xhr = new XMLHttpRequest();

                    function abortXhr() {
                        xhr.abort();
                    }

                    xhr.onload = function() {
                        var options = {
                            status: xhr.status,
                            statusText: xhr.statusText,
                            headers: parseHeaders(xhr.getAllResponseHeaders() || '')
                        };
                        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
                        var body = 'response' in xhr ? xhr.response : xhr.responseText;
                        resolve(new Response(body, options));
                    };

                    xhr.onerror = function() {
                        reject(new TypeError('Network request failed'));
                    };

                    xhr.ontimeout = function() {
                        reject(new TypeError('Network request failed'));
                    };

                    xhr.onabort = function() {
                        reject(new exports.DOMException('Aborted', 'AbortError'));
                    };

                    xhr.open(request.method, request.url, true);

                    if (request.credentials === 'include') {
                        xhr.withCredentials = true;
                    } else if (request.credentials === 'omit') {
                        xhr.withCredentials = false;
                    }

                    if ('responseType' in xhr && support.blob) {
                        xhr.responseType = 'blob';
                    }

                    //add no-cache
                    request.headers.append('Pragma', 'no-cache');
                    request.headers.forEach(function(value, name) {
                        xhr.setRequestHeader(name, value);
                    });

                    if (request.signal) {
                        request.signal.addEventListener('abort', abortXhr);

                        xhr.onreadystatechange = function() {
                            // DONE (success or failure)
                            if (xhr.readyState === 4) {
                                request.signal.removeEventListener('abort', abortXhr);
                            }
                        };
                    }

                    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
                })
            }

            fetch.polyfill = true;

            if (!self.fetch) {
                self.fetch = fetch;
                self.Headers = Headers;
                self.Request = Request;
                self.Response = Response;
            }

            exports.Headers = Headers;
            exports.Request = Request;
            exports.Response = Response;
            exports.fetch = fetch;

            Object.defineProperty(exports, '__esModule', { value: true });

        })));

    }).call(window);


}
