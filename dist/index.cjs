'use strict';

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _assertClassBrand(e, t, n) {
  if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _checkPrivateRedeclaration(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldGet2(s, a) {
  return s.get(_assertClassBrand(s, a));
}
function _classPrivateFieldInitSpec(e, t, a) {
  _checkPrivateRedeclaration(e, t), t.set(e, a);
}
function _classPrivateFieldSet2(s, a, r) {
  return s.set(_assertClassBrand(s, a), r), r;
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: !0
          } : {
            done: !1,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = !0,
    u = !1;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = !0, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && _setPrototypeOf(t, e);
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return e;
  };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function (t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function (t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(typeof e + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function (e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function () {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function (e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function (t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function (t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    catch: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function (e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (String )(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? new Map() : void 0;
  return _wrapNativeSuper = function (t) {
    if (null === t || !_isNativeFunction(t)) return t;
    if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t)) return r.get(t);
      r.set(t, Wrapper);
    }
    function Wrapper() {
      return _construct(t, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), _setPrototypeOf(Wrapper, t);
  }, _wrapNativeSuper(t);
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var lib = {exports: {}};

(function (module, exports) {
	!function(r,n){module.exports=n();}("undefined"!=typeof self?self:commonjsGlobal,(function(){return function(r){var n={};function e(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return r[t].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=r,e.c=n,e.d=function(r,n,t){e.o(r,n)||Object.defineProperty(r,n,{enumerable:!0,get:t});},e.r=function(r){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0});},e.t=function(r,n){if(1&n&&(r=e(r)),8&n)return r;if(4&n&&"object"==typeof r&&r&&r.__esModule)return r;var t=Object.create(null);if(e.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:r}),2&n&&"string"!=typeof r)for(var o in r)e.d(t,o,function(n){return r[n]}.bind(null,o));return t},e.n=function(r){var n=r&&r.__esModule?function(){return r.default}:function(){return r};return e.d(n,"a",n),n},e.o=function(r,n){return Object.prototype.hasOwnProperty.call(r,n)},e.p="",e(e.s=0)}([function(r,n,e){e.r(n),e.d(n,"md5",(function(){return p}));var t="0123456789abcdef".split("");var o=function(r){for(var n="",e=0;e<4;e++)n+=t[r>>8*e+4&15]+t[r>>8*e&15];return n};var u=function(r){for(var n=r.length,e=0;e<n;e++)r[e]=o(r[e]);return r.join("")};var f=function(r,n){return r+n&4294967295};var i=function(r,n,e,t,o,u,i){return function(r,n,e){return f(r<<n|r>>>32-n,e)}(n=function(r,n,e,t){return n=f(f(n,r),f(e,t))}(r,n,t,u),o,e)};var a=function(r,n,e,t,o,u,f,a){return i(e&t|~e&o,n,e,u,f,a)};var c=function(r,n,e,t,o,u,f,a){return i(e&o|t&~o,n,e,u,f,a)};var l=function(r,n,e,t,o,u,f,a){return i(e^t^o,n,e,u,f,a)};var d=function(r,n,e,t,o,u,f,a){return i(t^(e|~o),n,e,u,f,a)};var v=function(r,n,e){void 0===e&&(e=f);var t=r[0],o=r[1],u=r[2],i=r[3],v=a.bind(null,e);t=v(t,o,u,i,n[0],7,-680876936),i=v(i,t,o,u,n[1],12,-389564586),u=v(u,i,t,o,n[2],17,606105819),o=v(o,u,i,t,n[3],22,-1044525330),t=v(t,o,u,i,n[4],7,-176418897),i=v(i,t,o,u,n[5],12,1200080426),u=v(u,i,t,o,n[6],17,-1473231341),o=v(o,u,i,t,n[7],22,-45705983),t=v(t,o,u,i,n[8],7,1770035416),i=v(i,t,o,u,n[9],12,-1958414417),u=v(u,i,t,o,n[10],17,-42063),o=v(o,u,i,t,n[11],22,-1990404162),t=v(t,o,u,i,n[12],7,1804603682),i=v(i,t,o,u,n[13],12,-40341101),u=v(u,i,t,o,n[14],17,-1502002290),o=v(o,u,i,t,n[15],22,1236535329);var s=c.bind(null,e);t=s(t,o,u,i,n[1],5,-165796510),i=s(i,t,o,u,n[6],9,-1069501632),u=s(u,i,t,o,n[11],14,643717713),o=s(o,u,i,t,n[0],20,-373897302),t=s(t,o,u,i,n[5],5,-701558691),i=s(i,t,o,u,n[10],9,38016083),u=s(u,i,t,o,n[15],14,-660478335),o=s(o,u,i,t,n[4],20,-405537848),t=s(t,o,u,i,n[9],5,568446438),i=s(i,t,o,u,n[14],9,-1019803690),u=s(u,i,t,o,n[3],14,-187363961),o=s(o,u,i,t,n[8],20,1163531501),t=s(t,o,u,i,n[13],5,-1444681467),i=s(i,t,o,u,n[2],9,-51403784),u=s(u,i,t,o,n[7],14,1735328473),o=s(o,u,i,t,n[12],20,-1926607734);var b=l.bind(null,e);t=b(t,o,u,i,n[5],4,-378558),i=b(i,t,o,u,n[8],11,-2022574463),u=b(u,i,t,o,n[11],16,1839030562),o=b(o,u,i,t,n[14],23,-35309556),t=b(t,o,u,i,n[1],4,-1530992060),i=b(i,t,o,u,n[4],11,1272893353),u=b(u,i,t,o,n[7],16,-155497632),o=b(o,u,i,t,n[10],23,-1094730640),t=b(t,o,u,i,n[13],4,681279174),i=b(i,t,o,u,n[0],11,-358537222),u=b(u,i,t,o,n[3],16,-722521979),o=b(o,u,i,t,n[6],23,76029189),t=b(t,o,u,i,n[9],4,-640364487),i=b(i,t,o,u,n[12],11,-421815835),u=b(u,i,t,o,n[15],16,530742520),o=b(o,u,i,t,n[2],23,-995338651);var p=d.bind(null,e);t=p(t,o,u,i,n[0],6,-198630844),i=p(i,t,o,u,n[7],10,1126891415),u=p(u,i,t,o,n[14],15,-1416354905),o=p(o,u,i,t,n[5],21,-57434055),t=p(t,o,u,i,n[12],6,1700485571),i=p(i,t,o,u,n[3],10,-1894986606),u=p(u,i,t,o,n[10],15,-1051523),o=p(o,u,i,t,n[1],21,-2054922799),t=p(t,o,u,i,n[8],6,1873313359),i=p(i,t,o,u,n[15],10,-30611744),u=p(u,i,t,o,n[6],15,-1560198380),o=p(o,u,i,t,n[13],21,1309151649),t=p(t,o,u,i,n[4],6,-145523070),i=p(i,t,o,u,n[11],10,-1120210379),u=p(u,i,t,o,n[2],15,718787259),o=p(o,u,i,t,n[9],21,-343485551),r[0]=e(t,r[0]),r[1]=e(o,r[1]),r[2]=e(u,r[2]),r[3]=e(i,r[3]);};var s=function(r){for(var n=[],e=0;e<64;e+=4)n[e>>2]=r.charCodeAt(e)+(r.charCodeAt(e+1)<<8)+(r.charCodeAt(e+2)<<16)+(r.charCodeAt(e+3)<<24);return n};var b=function(r,n){var e,t=r.length,o=[1732584193,-271733879,-1732584194,271733878];for(e=64;e<=t;e+=64)v(o,s(r.substring(e-64,e)),n);var u=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],f=(r=r.substring(e-64)).length;for(e=0;e<f;e++)u[e>>2]|=r.charCodeAt(e)<<(e%4<<3);if(u[e>>2]|=128<<(e%4<<3),e>55)for(v(o,u,n),e=16;e--;)u[e]=0;return u[14]=8*t,v(o,u,n),o};function p(r){var n;return "5d41402abc4b2a76b9719d911017c592"!==u(b("hello"))&&(n=function(r,n){var e=(65535&r)+(65535&n);return (r>>16)+(n>>16)+(e>>16)<<16|65535&e}),u(b(r,n))}}])}));
	
} (lib));

var libExports = lib.exports;

var _marked = /*#__PURE__*/_regeneratorRuntime().mark(iterate_unique);
var FLT_EPSILON = 1.19209290e-7;
var path_separator_regex = /[\\\/]+/g;
var emoji_regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
var DIVIDERS = {
  d: 24 * 60 * 60 * 1000,
  h: 60 * 60 * 1000,
  m: 60 * 1000,
  s: 1000
};
var RefException = /*#__PURE__*/function (_Error) {
  function RefException(str) {
    _classCallCheck(this, RefException);
    return _callSuper(this, RefException, ["Invalid reference : ".concat(str)]);
  }
  _inherits(RefException, _Error);
  return _createClass(RefException);
}( /*#__PURE__*/_wrapNativeSuper(Error));
var PromisePool = /*#__PURE__*/function () {
  function PromisePool() {
    var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Infinity;
    _classCallCheck(this, PromisePool);
    this.executing = new Set();
    this.queue = [];
    this.limit = limit;
  }
  return _createClass(PromisePool, [{
    key: "full",
    get: function get() {
      return this.executing.size >= this.limit;
    }
  }, {
    key: "_next",
    value: function _next() {
      var _this2 = this;
      if (this.queue.length == 0 || this.executing.size >= this.limit) return;
      var _this$queue$shift = this.queue.shift(),
        _this$queue$shift2 = _slicedToArray(_this$queue$shift, 2),
        cb = _this$queue$shift2[0],
        resolve = _this$queue$shift2[1];
      var p = Promise.resolve(cb());
      this.executing.add(p);
      p.then(resolve);
      p["finally"](function () {
        _this2.executing["delete"](p);
        _this2._next();
      });
    }
  }, {
    key: "enqueue",
    value: function enqueue(cb) {
      var _this3 = this;
      return new Promise(function (resolve) {
        _this3.queue.push([cb, resolve]);
        _this3._next();
      });
    }
  }]);
}();
var EventEmitter = /*#__PURE__*/function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);
    _defineProperty(this, "_events", {});
    this.addEventListener = this.on;
    this.addListener = this.on;
    this.removeEventListener = this.off;
    this.removeListener = this.off;
  }
  return _createClass(EventEmitter, [{
    key: "on",
    value: function on(event, listener) {
      if (_typeof(this._events[event]) !== 'object') this._events[event] = [];
      this._events[event].push(listener);
    }
  }, {
    key: "removeAllListeners",
    value: function removeAllListeners() {
      clear(this._events);
    }
  }, {
    key: "off",
    value: function off(event, listener) {
      if (!event) {
        this.removeAllListeners();
        return;
      }
      if (_typeof(this._events[event]) !== 'object') return;
      if (listener) array_remove(this._events[event], listener);else clear(this._events[event]);
    }
  }, {
    key: "emit",
    value: function emit(event) {
      if (_typeof(this._events[event]) !== 'object') return;
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      for (var _i = 0, _arr = _toConsumableArray(this._events[event]); _i < _arr.length; _i++) {
        var l = _arr[_i];
        l.apply(this, args);
      }
    }
  }, {
    key: "once",
    value: function once(event, listener) {
      var _this4 = this;
      var _listener_wrapped = function listener_wrapped() {
        _this4.removeListener(event, _listener_wrapped);
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        listener.apply(_this4, args);
      };
      this.on(event, _listener_wrapped);
    }
  }]);
}();
var Timer = /*#__PURE__*/function (_EventEmitter2) {
  function Timer() {
    var _this5;
    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var autostart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    _classCallCheck(this, Timer);
    _this5 = _callSuper(this, Timer);
    _this5._total_time = time;
    _this5._interval_id;
    _this5._last_seconds_left;
    _this5._stopwatch = new StopWatch();
    _this5._stopwatch.on("pause", function () {
      clearInterval(_this5._interval_id);
      _this5.emit("pause");
    });
    _this5._stopwatch.on("start", function () {
      _this5._interval_id = setInterval(function () {
        return _this5.tick();
      }, Timer.TICK_INTERVAL);
      _this5.emit("start");
    });
    _this5._stopwatch.on("reset", function () {
      _this5._last_seconds_left = _this5.seconds_left;
      _this5.emit("reset");
      _this5.emit("second", _this5._last_seconds_left);
    });
    if (autostart) _this5.restart();
    return _this5;
  }
  _inherits(Timer, _EventEmitter2);
  return _createClass(Timer, [{
    key: "time_left",
    get: function get() {
      return Math.max(0, this._total_time - this._stopwatch.time);
    }
  }, {
    key: "seconds_left",
    get: function get() {
      return Math.ceil(this.time_left / 1000);
    }
  }, {
    key: "finished",
    get: function get() {
      return this.time_left <= 0;
    }
  }, {
    key: "paused",
    get: function get() {
      return this._stopwatch.paused;
    }
  }, {
    key: "restart",
    value: function restart(time) {
      if (time !== undefined) this._total_time = time;
      this._stopwatch.reset();
      this.resume();
    }
  }, {
    key: "tick",
    value: function tick() {
      var seconds_left = this.seconds_left;
      for (var i = this._last_seconds_left - 1; i >= seconds_left; i--) {
        this.emit("second", i);
      }
      this._last_seconds_left = seconds_left;
      this.emit("tick");
      if (this.finished) {
        this.pause();
        this.emit("finish");
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      this._stopwatch.pause();
    }
  }, {
    key: "resume",
    value: function resume() {
      this._stopwatch.resume();
    }
  }, {
    key: "reset",
    value: function reset() {
      this._stopwatch.reset();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._stopwatch.destroy();
      this.removeAllListeners();
    }
  }]);
}(EventEmitter);
Timer.TICK_INTERVAL = 1000 / 60;
var StopWatch = /*#__PURE__*/function (_EventEmitter3) {
  function StopWatch() {
    var _this6;
    _classCallCheck(this, StopWatch);
    _this6 = _callSuper(this, StopWatch);
    _this6._start_time = 0;
    _this6._pause_time = 0;
    _this6._paused = true;
    return _this6;
  }
  _inherits(StopWatch, _EventEmitter3);
  return _createClass(StopWatch, [{
    key: "time",
    get: function get() {
      return (this._paused ? this._pause_time : Date.now()) - this._start_time;
    }
  }, {
    key: "paused",
    get: function get() {
      return this._paused;
    }
  }, {
    key: "start",
    value: function start() {
      var now = Date.now();
      if (!this._start_time) this._start_time = now;
      if (this._paused) {
        this._paused = false;
        this._start_time += now - this._pause_time;
        this._pause_time = 0;
        this.emit("start");
      }
    }
  }, {
    key: "resume",
    value: function resume() {
      this.start();
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this._paused) return;
      this._paused = true;
      this._pause_time = Date.now();
      this.emit("pause");
    }
  }, {
    key: "reset",
    value: function reset() {
      this._start_time = Date.now();
      if (this._paused) this._pause_time = this._start_time;
      this.emit("reset");
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.removeAllListeners();
    }
  }]);
}(EventEmitter);
var Diff = /*#__PURE__*/_createClass(function Diff(old_value, new_value) {
  _classCallCheck(this, Diff);
  if (old_value === new_value) this.type = 0;
  if (old_value === undefined) this.type = Diff.CREATED;else if (new_value === undefined) this.type = Diff.DELETED;else this.type = Diff.CHANGED;
  this.old_value = old_value;
  this.new_value = new_value;
  Object.freeze(this);
});
Diff.CREATED = 1;
Diff.DELETED = 2;
Diff.CHANGED = 3;

/* class History {
	get current() { return this.get(this.i); }
	get prev() { return this.get(this.i-1); }
	get next() { return this.get(this.i+1); }
	get can_go_back() { return this.has(this.i-1); }
	get can_go_forward() { return this.has(this.i+1); }
	constructor(length=512, json_encode=false, compress=false) {
		this.length = length;
		this.reset();
		if (compress && !!window.LZUTF8) this.compress = true;
		this.json_encode = json_encode;
	}
	push(state) {
		this.i++;
		var s = typeof state === "string";
		if (this.json_encode) state = JSON.stringify(state);
		if (this.compress) state = LZUTF8.compress(state);
		this.states[this.i%this.length] = {states:state,i:this.i};
		for (var i = this.i; i < this.i + this.length; i++) {
			var o = this.states[i%this.length];
			if (!o || o.i <= this.i) break;
			this.states[i%this.length] = null;
		}
	}
	has(i) {
		var s = this.states[i%this.length];
		return (s && s.i == i);
	}
	get(i) {
		if (!this.has(i)) return;
		var state = s.state;
		if (this.compress) state = LZUTF8.decompress(state);
		if (this.json_encode) state = JSON.parse(state);
		else return state;
	}
	goto(i) {
		if (!this.has(i)) return;
		this.i = i;
		return this.current;
	}
	go_back() { return this.goto(this.i-1); }
	go_forward() { return this.goto(this.i+1); }
	reset() {
		this.i = -1;
		this.states = new Array(this.length);
	}
} */
var URLParams = /*#__PURE__*/function () {
  function URLParams(params_str) {
    _classCallCheck(this, URLParams);
    this._params = [];
    if (!params_str) return;
    if (params_str.substr(0, 1) == "?") params_str = params_str.slice(1);
    var _iterator = _createForOfIteratorHelper(params_str.split("&")),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var p = _step.value;
        this.append.apply(this, _toConsumableArray(p.split("=")));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  return _createClass(URLParams, [{
    key: "append",
    value: function append(param) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var p = {
        name: param
      };
      if (value !== undefined) p.value = String(value);
      Object.freeze(p);
      this._params.push(p);
    }
  }, {
    key: "remove",
    value: function remove(param) {
      if (_typeof(param) === "object") {
        this._params.filter(function (p) {
          return p !== param;
        });
      } else {
        this._params = this._params.filter(function (p) {
          return p.name != param;
        });
      }
    }
  }, {
    key: Symbol.iterator,
    value: /*#__PURE__*/_regeneratorRuntime().mark(function value() {
      var _iterator2, _step2, p;
      return _regeneratorRuntime().wrap(function value$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _iterator2 = _createForOfIteratorHelper(this._params);
            _context.prev = 1;
            _iterator2.s();
          case 3:
            if ((_step2 = _iterator2.n()).done) {
              _context.next = 9;
              break;
            }
            p = _step2.value;
            _context.next = 7;
            return p;
          case 7:
            _context.next = 3;
            break;
          case 9:
            _context.next = 14;
            break;
          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](1);
            _iterator2.e(_context.t0);
          case 14:
            _context.prev = 14;
            _iterator2.f();
            return _context.finish(14);
          case 17:
          case "end":
            return _context.stop();
        }
      }, value, this, [[1, 11, 14, 17]]);
    })
  }, {
    key: "toString",
    value: function toString() {
      return this._params.map(function (p) {
        if (p.value === undefined) return p.name;
        return "".concat(p.name, "=").concat(p.value);
      }).join("&");
    }
  }]);
}();
var Point = /*#__PURE__*/_createClass(function Point(x, y) {
  _classCallCheck(this, Point);
  this.x = x;
  this.y = y;
});
Point.distance = function (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2), Math.pow(y2 - y1, 2));
};
var Rectangle = /*#__PURE__*/function () {
  function Rectangle() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    _classCallCheck(this, Rectangle);
    args = function () {
      if (args.length == 4) return args;
      if (args.length == 2) return [0, 0].concat(_toConsumableArray(args));
      if (args.length == 1) {
        if (Array.isArray(args[0])) return args[0];
        if (_typeof(args[0]) === "object") {
          var _args$ = args[0],
            x = _args$.x,
            y = _args$.y,
            width = _args$.width,
            height = _args$.height,
            left = _args$.left,
            right = _args$.right,
            bottom = _args$.bottom,
            top = _args$.top;
          if (x == undefined) x = left;
          if (y == undefined) y = top;
          if (width == undefined) width = right - left;
          if (height == undefined) height = bottom - top;
          return [x, y, width, height];
        }
      }
      if (args.length == 0) return [0, 0, 0, 0];
    }();
    this.x = +args[0] || 0;
    this.y = +args[1] || 0;
    this.width = +args[2] || 0;
    this.height = +args[3] || 0;
  }
  return _createClass(Rectangle, [{
    key: "left",
    get: function get() {
      return this.x;
    },
    set: function set(value) {
      var d = value - this.x;
      this.x += d;
      this.width -= d;
    }
  }, {
    key: "top",
    get: function get() {
      return this.y;
    },
    set: function set(value) {
      var d = value - this.y;
      this.y += d;
      this.height -= d;
    }
  }, {
    key: "right",
    get: function get() {
      return this.x + this.width;
    },
    set: function set(value) {
      this.width += value - this.right;
    }
  }, {
    key: "bottom",
    get: function get() {
      return this.y + this.height;
    },
    set: function set(value) {
      this.height += value - this.bottom;
    }
  }, {
    key: "center",
    get: function get() {
      return {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2
      };
    }
  }, {
    key: "contains",
    value: function contains(obj) {
      if (!obj.width && !obj.height) return obj.x > this.left && obj.x < this.right && obj.y > this.top && obj.y < this.bottom;
      return obj.x > this.left && obj.x + obj.width < this.right && obj.y > this.top && obj.y + obj.height < this.bottom;
    }
  }, {
    key: "intersects",
    value: function intersects(obj) {
      return obj.x + obj.width > this.left && obj.x < this.right && obj.y + obj.height > this.top && obj.y < this.bottom;
    }
  }, {
    key: "union",
    value: function union(obj) {
      var x = Math.min(obj.x, this.x);
      var y = Math.min(obj.y, this.y);
      var right = Math.max(obj.x + (obj.width || 0), this.right);
      var bottom = Math.max(obj.y + (obj.height || 0), this.bottom);
      return new Rectangle(x, y, right - x, bottom - y);
    }
  }, {
    key: "intersection",
    value: function intersection(obj) {
      var x = Math.max(obj.x, this.x);
      var y = Math.max(obj.y, this.y);
      var right = Math.min(obj.x + obj.width, this.right);
      var bottom = Math.min(obj.y + obj.height, this.bottom);
      return new Rectangle(x, y, right - x, bottom - y);
    }
  }, {
    key: "scale",
    value: function scale(x, y) {
      if (y === undefined) y = x;
      this.x *= x;
      this.y *= y;
      this.width *= x;
      this.height *= y;
      return this;
    }
  }, {
    key: "expand",
    value: function expand(x, y) {
      if (y === undefined) y = x;
      this.x -= x / 2;
      this.y -= y / 2;
      this.width += x;
      this.height += y;
      return this;
    }
  }, {
    key: "fix",
    value: function fix() {
      if (this.width < 0) {
        this.x += this.width;
        this.width *= -1;
      }
      if (this.height < 0) {
        this.y += this.height;
        this.height *= -1;
      }
      return this;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Rectangle(this.x, this.y, this.width, this.height);
    }
  }, {
    key: "equals",
    value: function equals(obj) {
      try {
        return this.x === obj.x && this.y === obj.y && this.width === obj.width && this.height === obj.height;
      } catch (_unused) {
        return false;
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      return "[Rectangle x:".concat(this.x, " y:").concat(this.y, " width:").concat(this.width, " height:").concat(this.height, "]");
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      };
    }
  }]);
}();
Rectangle.union = function () {
  for (var _len4 = arguments.length, rects = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    rects[_key4] = arguments[_key4];
  }
  var x = Math.min.apply(Math, _toConsumableArray(rects.map(function (r) {
    return r.x;
  })));
  var y = Math.min.apply(Math, _toConsumableArray(rects.map(function (r) {
    return r.y;
  })));
  var right = Math.max.apply(Math, _toConsumableArray(rects.map(function (r) {
    return r.x + r.width;
  })));
  var bottom = Math.max.apply(Math, _toConsumableArray(rects.map(function (r) {
    return r.y + r.height;
  })));
  return new Rectangle(x, y, right - x, bottom - y);
};
Rectangle.intersection = function () {
  for (var _len5 = arguments.length, rects = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    rects[_key5] = arguments[_key5];
  }
  var x = Math.max.apply(Math, _toConsumableArray(rects.map(function (r) {
    return r.x;
  })));
  var y = Math.max.apply(Math, _toConsumableArray(rects.map(function (r) {
    return r.y;
  })));
  var right = Math.min.apply(Math, _toConsumableArray(rects.map(function (r) {
    return r.x + r.width;
  })));
  var bottom = Math.min.apply(Math, _toConsumableArray(rects.map(function (r) {
    return r.y + r.height;
  })));
  return new Rectangle(x, y, right - x, bottom - y);
};
var TimeoutError = /*#__PURE__*/function (_Error2) {
  function TimeoutError(message) {
    var _this7;
    _classCallCheck(this, TimeoutError);
    _this7 = _callSuper(this, TimeoutError, [message]);
    _this7.name = "TimeoutError";
    return _this7;
  }
  _inherits(TimeoutError, _Error2);
  return _createClass(TimeoutError);
}( /*#__PURE__*/_wrapNativeSuper(Error));
var Color = /*#__PURE__*/function () {
  function Color() {
    for (var _len6 = arguments.length, components = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      components[_key6] = arguments[_key6];
    }
    _classCallCheck(this, Color);
    this._r = 0;
    this._g = 0;
    this._b = 0;
    this._h = 0;
    this._s = 0;
    this._l = 0;
    this._a = 1.0;
    if (components.length == 1) {
      var c = components[0];
      if (Array.isArray(c)) {
        s;
        components = _toConsumableArray(c);
      } else if (_typeof(c) === "object") {
        components = [c.r || c.red || 0, c.g || c.green || 0, c.b || c.blue || 0, c.a || c.alpha || 1];
      } else if (typeof c === "string") {
        if (c.charAt(0) === "#") c = c.slice(1);else if (c.substring(0, 2) === "0x") c = c.slice(2);
        if (c.length < 6) components = c.split("").map(function (a) {
          return a + a;
        });else components = c.match(/.{1,2}/g);
      }
    }
    components = components.map(function (c) {
      if (typeof c === "string" && c.match(/^[0-9a-f]{2}$/)) return parseInt(c, 16);
      return +c;
    });
    this.from_rgba.apply(this, _toConsumableArray(components));
  }
  return _createClass(Color, [{
    key: "r",
    get: function get() {
      return this._r;
    }
  }, {
    key: "g",
    get: function get() {
      return this._g;
    }
  }, {
    key: "b",
    get: function get() {
      return this._b;
    }
  }, {
    key: "h",
    get: function get() {
      return this._h;
    }
  }, {
    key: "s",
    get: function get() {
      return this._s;
    }
  }, {
    key: "l",
    get: function get() {
      return this._l;
    }
  }, {
    key: "a",
    get: function get() {
      return this._a;
    }
  }, {
    key: "from_hsl",
    value: function from_hsl() {
      var h = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var l = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return this.from_hsla(h, s, l, 1);
    }
  }, {
    key: "from_hsla",
    value: function from_hsla() {
      var h = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var l = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      this._h = h = clamp(h, 0, 1);
      this._s = s = clamp(s, 0, 1);
      this._l = l = clamp(l, 0, 1);
      this._a = a = clamp(a, 0, 1);
      var r, g, b;
      if (s == 0) {
        r = g = b = l;
      } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = Color.hue2rgb(p, q, h + 1 / 3);
        g = Color.hue2rgb(p, q, h);
        b = Color.hue2rgb(p, q, h - 1 / 3);
      }
      this._r = Math.round(r * 255);
      this._g = Math.round(g * 255);
      this._b = Math.round(b * 255);
      return this;
    }
  }, {
    key: "from_rgb",
    value: function from_rgb() {
      var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return this.from_rgba(r, g, b, 1);
    }
  }, {
    key: "from_rgba",
    value: function from_rgba() {
      var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      this._r = r = Math.round(clamp(r, 0, 255));
      this._g = g = Math.round(clamp(g, 0, 255));
      this._b = b = Math.round(clamp(b, 0, 255));
      this._a = a = Math.round(clamp(a, 0, 1));
      r /= 255;
      g /= 255;
      b /= 255;
      var cMax = Math.max(r, g, b);
      var cMin = Math.min(r, g, b);
      var delta = cMax - cMin;
      var l = (cMax + cMin) / 2;
      var h = 0;
      var s = 0;
      if (delta == 0) h = 0;else if (cMax == r) h = 60 * ((g - b) / delta % 6);else if (cMax == g) h = 60 * ((b - r) / delta + 2);else h = 60 * ((r - g) / delta + 4);
      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      this._h = h;
      this._s = s;
      this._l = l;
      return this;
    }
  }, {
    key: "rgb_mix",
    value: function rgb_mix(c) {
      var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
      return this.rgba_mix(c, m);
    }
  }, {
    key: "rgba_mix",
    value: function rgba_mix(c) {
      var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
      c = Color.from(c);
      return new Color(lerp(this._r, c.r, m), lerp(this._g, c.g, m), lerp(this._b, c.b, m), lerp(this._a, c.a, m));
    }
  }, {
    key: "hsl_mix",
    value: function hsl_mix(c) {
      var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
      return this.hsla_mix(c, m);
    }
  }, {
    key: "hsla_mix",
    value: function hsla_mix(c) {
      var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
      c = Color.from(c);
      return new Color(lerp(this._h, c.h, m), lerp(this._s, c.s, m), lerp(this._l, c.l, m), lerp(this._a, c.a, m));
    }
  }, {
    key: "to_hsl_array",
    value: function to_hsl_array() {
      return [this._h, this._s, this._l];
    }
  }, {
    key: "to_rgb_array",
    value: function to_rgb_array() {
      return [this._r, this._g, this._b];
    }
  }, {
    key: "to_hsla_array",
    value: function to_hsla_array() {
      return [this._h, this._s, this._l, this._a];
    }
  }, {
    key: "to_rgba_array",
    value: function to_rgba_array() {
      return [this._r, this._g, this._b, this._a];
    }
  }, {
    key: "to_hsl_string",
    value: function to_hsl_string() {
      return "hsl(".concat(this._h, ", ").concat(this._s, ", ").concat(this._l, ")");
    }
  }, {
    key: "to_rgb_string",
    value: function to_rgb_string() {
      return "rgb(".concat(this._r, ", ").concat(this._g, ", ").concat(this._b, ")");
    }
  }, {
    key: "to_hsla_string",
    value: function to_hsla_string() {
      return "hsla(".concat(this._h, ", ").concat(this._s, ", ").concat(this._l, ", ").concat(this._a, ")");
    }
  }, {
    key: "to_rgba_string",
    value: function to_rgba_string() {
      return "rgba(".concat(this._r, ", ").concat(this._g, ", ").concat(this._b, ", ").concat(this._a, ")");
    }
  }, {
    key: "to_rgb_hex",
    value: function to_rgb_hex() {
      return "#".concat(this._r.toString(16)).concat(this._g.toString(16)).concat(this._b.toString(16));
    }
  }, {
    key: "to_rgba_hex",
    value: function to_rgba_hex() {
      return "#".concat(this._r.toString(16)).concat(this._g.toString(16)).concat(this._b.toString(16)).concat(this._a.toString(16));
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.to_rgba_string();
    }
  }, {
    key: "copy",
    value: function copy() {
      var c = new Color();
      c._r = this._r;
      c._g = this._g;
      c._b = this._b;
      c._h = this._h;
      c._s = this._s;
      c._l = this._l;
      c._a = this._a;
      return c;
    }
  }]);
}();
Color.from = function () {
  for (var _len7 = arguments.length, components = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    components[_key7] = arguments[_key7];
  }
  if (components.length === 1 && components[0] instanceof Color) {
    return components[0];
  }
  return _construct(Color, components);
};
Color.mix = function (c1, c2) {
  var m = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
  return Color.from(c1).mix(c2, m);
};
Color.hue_to_rgb = function (p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

/** @typedef {{interval:number, immediate:bool, await:bool, context:any}} IntervalOptions  */
var _options = /*#__PURE__*/new WeakMap();
var _ticks = /*#__PURE__*/new WeakMap();
var _destroyed = /*#__PURE__*/new WeakMap();
var _last_tick = /*#__PURE__*/new WeakMap();
var _timeout = /*#__PURE__*/new WeakMap();
var Interval = /*#__PURE__*/function () {
  /** @param {function():void} callback @param {IntervalOptions} opts */
  function Interval(callback, opts) {
    _classCallCheck(this, Interval);
    /** @type {IntervalOptions} */
    _classPrivateFieldInitSpec(this, _options, void 0);
    _classPrivateFieldInitSpec(this, _ticks, 0);
    _classPrivateFieldInitSpec(this, _destroyed, false);
    _classPrivateFieldInitSpec(this, _last_tick, 0);
    _classPrivateFieldInitSpec(this, _timeout, void 0);
    if (_typeof(opts) !== "object") opts = {
      interval: opts
    };
    _classPrivateFieldSet2(_options, this, Object.assign({
      interval: 10000,
      immediate: false,
      "await": true,
      context: null
    }, opts));
    /** @type {IntervalOptions} */
    this.options = options_proxy(_classPrivateFieldGet2(_options, this));
    if (!this.options.immediate) _classPrivateFieldSet2(_last_tick, this, Date.now());
    this.callback = callback;
    if (this.options.immediate) this.tick();else this.next();
  }
  return _createClass(Interval, [{
    key: "time_since_last_tick",
    get: function get() {
      return Math.max(0, Date.now() - _classPrivateFieldGet2(_last_tick, this));
    }
  }, {
    key: "time_until_next_tick",
    get: function get() {
      return Math.max(0, this.options.interval - this.time_since_last_tick);
    }
  }, {
    key: "update",
    value: function update(opts) {
      Object.assign(_classPrivateFieldGet2(_options, this), opts);
    }
  }, {
    key: "tick",
    value: function () {
      var _tick = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _this$ticks;
        var callback_args,
          ticks,
          _args2 = arguments;
        return _regeneratorRuntime().wrap(function _callee$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              callback_args = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : null;
              ticks = _classPrivateFieldSet2(_ticks, this, (_this$ticks = _classPrivateFieldGet2(_ticks, this), ++_this$ticks));
              if (!_classPrivateFieldGet2(_options, this)["await"]) {
                _context2.next = 5;
                break;
              }
              _context2.next = 5;
              return this._current_promise;
            case 5:
              if (!_classPrivateFieldGet2(_destroyed, this) && ticks == _classPrivateFieldGet2(_ticks, this)) {
                _classPrivateFieldSet2(_last_tick, this, Date.now());
                this._current_promise = Promise.resolve(this.callback.apply(this.options.context, callback_args));
                this.next();
              }
              return _context2.abrupt("return", this._current_promise);
            case 7:
            case "end":
              return _context2.stop();
          }
        }, _callee, this);
      }));
      function tick() {
        return _tick.apply(this, arguments);
      }
      return tick;
    }()
  }, {
    key: "next",
    value: function () {
      var _next2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var _this8 = this;
        return _regeneratorRuntime().wrap(function _callee2$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              clearTimeout(_classPrivateFieldGet2(_timeout, this));
              _classPrivateFieldSet2(_timeout, this, setTimeout(function () {
                return _this8.tick();
              }, this.options.interval));
            case 2:
            case "end":
              return _context3.stop();
          }
        }, _callee2, this);
      }));
      function next() {
        return _next2.apply(this, arguments);
      }
      return next;
    }()
  }, {
    key: "destroy",
    value: function destroy() {
      _classPrivateFieldSet2(_destroyed, this, true);
      clearTimeout(_classPrivateFieldGet2(_timeout, this));
    }
  }]);
}();
function options_proxy(opts) {
  return new Proxy(opts, {
    get: function get(target, prop, receiver) {
      if (prop in target) {
        if (typeof target[prop] === "function") return target[prop]();
        return target[prop];
      }
    }
  });
}
var OrderedSet = /*#__PURE__*/function () {
  function OrderedSet(items) {
    _classCallCheck(this, OrderedSet);
    this.set = new Set();
    this.array = [];
    if (Symbol.iterator in Object(items)) {
      var _iterator3 = _createForOfIteratorHelper(items),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var i = _step3.value;
          this.add(i);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }
  return _createClass(OrderedSet, [{
    key: "add",
    value: function add(item) {
      if (this.set.has(item)) return false;
      this.set.add(item);
      this.array.push(item);
      return true;
    }
  }, {
    key: "delete",
    value: function _delete(item) {
      if (!this.set.has(item)) return false;
      this.set["delete"](item);
      this.array.splice(this.array.indexOf(item), 1);
      return true;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.set.clear();
      this.array = [];
    }
  }, {
    key: "has",
    value: function has(item) {
      return this.set.has(item);
    }
  }, {
    key: "indexOf",
    value: function indexOf(item) {
      return this.array.indexOf(item);
    }
  }, {
    key: "size",
    get: function get() {
      return this.set.size;
    }
  }, {
    key: Symbol.iterator,
    value: function value() {
      return this.array[Symbol.iterator]();
    }
  }]);
}();

/** @typedef {{path:string, type:string, old_value:any new_value:any, nested:boolean}} ObserverChange */
/** @callback ObserverListenerCallback @param {ObserverChange} change */

var Observer = function () {
  var Observer_core = Symbol("Observer_core");
  var Observer_target = Symbol("Observer_target");
  var CHANGE = Object.freeze({
    set: "set",
    update: "update",
    "delete": "delete"
  });

  // var force_emit = false;
  /** @return {Proxy} */
  function Observer(target) {
    var _this = this;
    /** @type {ObserverListenerCallback[]} */
    var listeners = [];
    var parents = new Map();
    function listen(cb) {
      listeners.push(cb);
    }
    function unlisten(cb) {
      array_remove(listeners, cb);
    }
    function destroy() {
      listeners.splice(0, listeners.length);
      for (var _i2 = 0, _Array$from = Array.from(parents); _i2 < _Array$from.length; _i2++) {
        var _Array$from$_i = _slicedToArray(_Array$from[_i2], 2),
          key = _Array$from$_i[0],
          parent = _Array$from$_i[1];
        delete parent.proxy[key];
      }
    }
    function emit(path, type, old_value, new_value) {
      var nested = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      // technically accurate - to track changes objects must be deep copied here... but unnecessary for my purposes.
      // if (Observer.is_proxy(old_value)) old_value = deep_copy(old_value);
      // if (Observer.is_proxy(new_value)) new_value = deep_copy(new_value);
      if (listeners.length) {
        var _iterator4 = _createForOfIteratorHelper(listeners),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var listener = _step4.value;
            listener.apply(_this, [{
              path: path,
              type: type,
              old_value: old_value,
              new_value: new_value,
              nested: nested
            }]);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
      var _iterator5 = _createForOfIteratorHelper(parents),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _step5$value = _slicedToArray(_step5.value, 2),
            key = _step5$value[0],
            parent = _step5$value[1];
          parent.emit([key].concat(_toConsumableArray(path)), type, old_value, new_value, nested);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
    Object.assign(this, {
      parents: parents,
      listen: listen,
      unlisten: unlisten,
      destroy: destroy,
      emit: emit
    });

    // -----------------

    function walk(o, delegate) {
      var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      if (_typeof(o) !== "object" || o === null) return;
      for (var k in o) {
        var sub_path = [].concat(_toConsumableArray(path), [k]);
        delegate.apply(o, [sub_path, o[k]]);
        walk(o[k], delegate, sub_path);
      }
    }
    function klaw(o, delegate) {
      var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      if (_typeof(o) !== "object" || o === null) return;
      for (var k in o) {
        var sub_path = [].concat(_toConsumableArray(path), [k]);
        klaw(o[k], delegate, sub_path);
        delegate.apply(o, [sub_path, o[k]]);
      }
    }
    function try_unregister_child(child, prop) {
      var child_observer = Observer.get_observer(child);
      if (child_observer && child_observer instanceof Observer) {
        klaw(child, function (path, val) {
          emit([prop].concat(_toConsumableArray(path)), CHANGE["delete"], val, undefined, true);
        });
        child_observer.parents["delete"](prop);
      }
    }
    function try_register_child(child, prop) {
      var child_observer = Observer.get_observer(child);
      if (child_observer && child_observer instanceof Observer) {
        walk(child, function (path, val) {
          emit([prop].concat(_toConsumableArray(path)), CHANGE.set, undefined, val, true);
        });
        child_observer.parents.set(prop, _this);
      }
    }

    // -----------------

    // !! Arrays (shift(), splice(), etc.) produce TONS of events... consider replacing arrays with special object that doesnt emit so many changes.

    var validator = {
      get: function get(target, prop) {
        if (prop === Observer_core) return _this;
        if (prop === Observer_target) return target;
        return target[prop];
      },
      set: function set(target, prop, new_value) {
        var old_value = target[prop];
        new_value = Observer.resolve(new_value);
        var changed = old_value !== new_value;
        if (changed) {
          var type = target[prop] === undefined ? CHANGE.set : CHANGE.update;
          try_unregister_child(old_value, prop);
          target[prop] = new_value;
          emit([prop], type, old_value, new_value);
          try_register_child(new_value, prop);
        }
        return true;
      },
      deleteProperty: function deleteProperty(target, prop) {
        if (prop in target) {
          var old_value = target[prop];
          try_unregister_child(old_value, prop);
          delete target[prop];
          emit([prop], CHANGE["delete"], old_value, undefined);
        }
        return true;
      } // defineProperty(target, prop, descriptor) {
      // },
      // enumerate(target, prop) {
      // },
      // ownKeys(target, prop) {
      // },
      // has(target, prop) {
      // },
      // getOwnPropertyDescriptor(target, prop) {
      // },
      // construct(target, prop) {
      // },
      // apply(target, thisArg, argumentsList) {
      // }
    };
    var proxy = new Proxy(Array.isArray(target) ? [] : {}, validator);
    Object.assign(proxy, target);
    _this.proxy = proxy;
    return proxy;
  }
  var RESET_KEY = "__RESET_0f726b__";
  Observer.RESET_KEY = RESET_KEY;
  Observer.get_observer = function (proxy) {
    if (proxy == null) return null;
    return proxy[Observer_core];
  };
  Observer.get_target = function (proxy) {
    if (proxy == null) return null;
    return proxy[Observer_target];
  };
  Observer.is_proxy = function (proxy) {
    return !!Observer.get_observer(proxy);
  };
  /** @param {ObserverListenerCallback} cb */
  Observer.listen = function (proxy, cb) {
    var observer = Observer.get_observer(proxy);
    if (observer) observer.listen(cb);
    return cb;
  };
  /** @param {ObserverListenerCallback} cb */
  Observer.unlisten = function (proxy, cb) {
    var observer = Observer.get_observer(proxy);
    if (observer) observer.unlisten(cb);
  };
  Observer.resolve = function (object) {
    if (Observer.is_proxy(object) || object === null || _typeof(object) !== "object") return object;
    return new Observer(object);
  };
  Observer.destroy = function (proxy) {
    var observer = Observer.get_observer(proxy);
    if (observer) observer.destroy();
  };
  /* Observer.apply_change = function(c, target) {
  	var value_name = c.path[c.path.length-1];
  	for (var i = 0; i < c.path.length-1; i++) {
  		var p = c.path[i];
  		if (target[p] === undefined) target[p] = {};
  		target = target[p];
  	}
  	var value = c.new_value;
  	if (Observer.is_proxy(value)) value = deep_copy(value);
  	if (c.old_value != null && value !== null && typeof value === "object" && !Array.isArray(value)) {
  		value.__RESET__ = 1;
  	}
  	target[value_name] = (Observer.is_proxy(value)) ? deep_copy(value) : value;
  } */
  Observer.flatten_changes = function (changes) {
    var result = {};
    var _iterator6 = _createForOfIteratorHelper(changes),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var c = _step6.value;
        var key = c.path[c.path.length - 1];
        var r = result;
        for (var _i3 = 0; _i3 < c.path.length - 1; _i3++) {
          var p = c.path[_i3];
          if (r[p] === undefined) r[p] = {};
          r = r[p];
        }
        var new_value = c.new_value;
        if (Observer.is_proxy(new_value)) {
          var target = Observer.get_target(new_value);
          new_value = {};
          if (c.old_value !== null) {
            new_value[RESET_KEY] = Array.isArray(target) ? 1 : 0; // 1 = Array, 0 = Object
          }
        }
        r[key] = new_value;
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    return result;
  };

  // root must be object, not array.
  Observer.apply_changes = function (target, changes) {
    var _apply = function apply(target, changes) {
      for (var k in changes) {
        if (k === RESET_KEY) continue;
        if (_typeof(changes[k]) === 'object' && changes[k] !== null) {
          if (RESET_KEY in changes[k]) {
            if (!target[k] || Array.isArray(target[k]) != changes[k][RESET_KEY]) {
              target[k] = changes[k][RESET_KEY] ? [] : {};
            } else {
              clear(target[k]); // VERY IMPORTANT - this keeps any prototype stuff.
            }
          }
          if (_typeof(target[k]) !== "object" || target[k] === null) {
            target[k] = Array.isArray(changes[k]) ? [] : {};
          }
          _apply(target[k], changes[k]);
          if (Array.isArray(changes[k])) target[k].length = changes[k].length;
        } else if (changes[k] === null) {
          delete target[k];
        } else {
          target[k] = changes[k];
        }
      }
    };
    _apply(target, changes);
  };
  return Observer;
}();

/** @typedef {{[0]:number, [1]:number, next:RangeTreeNode}} RangeTreeNode */
var RangeTree = /*#__PURE__*/function () {
  function RangeTree(values) {
    _classCallCheck(this, RangeTree);
    /** @type {RangeTreeNode} */
    this._first = null;
    if (values) {
      var _iterator7 = _createForOfIteratorHelper(values),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var v = _step7.value;
          this.add(v[0], v[1]);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  }
  return _createClass(RangeTree, [{
    key: "values",
    get: function get() {
      return _toConsumableArray(this);
    }
  }, {
    key: "total",
    get: function get() {
      var a = 0;
      var _iterator8 = _createForOfIteratorHelper(this),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var p = _step8.value;
          a += p[1] - p[0];
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
      return a;
    }
  }, {
    key: "add",
    value: function add(start, end) {
      if (start < 0) throw new Error("start must be >= 0: ".concat(start));
      if (start > end) throw new Error("start must be smaller than end: ".concat(start, " > ").concat(end));
      if (start == end) return;
      /** @type {RangeTreeNode} */
      var new_node = [start, end];
      if (!this._first || new_node[0] < this._first[0]) {
        new_node.next = this._first;
        this._first = new_node;
      }
      var curr = this._first;
      while (curr) {
        if (!curr.next || curr.next[0] > new_node[0]) {
          var n = curr.next;
          curr.next = new_node;
          new_node.next = n;
          if (new_node[0] <= curr[1] && new_node[0] >= curr[0]) {
            curr[1] = Math.max(new_node[1], curr[1]);
            curr.next = new_node.next;
          }
          if (new_node[1] <= curr[0] && new_node[1] >= curr[1]) {
            curr[0] = Math.min(new_node[0], curr[0]);
            curr.next = new_node.next;
          }
          while (curr.next && curr[1] >= curr.next[0]) {
            curr[1] = Math.max(curr[1], curr.next[1]);
            curr.next = curr.next.next;
          }
          break;
        }
        curr = curr.next;
      }
    }
  }, {
    key: "includes",
    value: function includes(low, high) {
      if (!high) high = low;
      var _iterator9 = _createForOfIteratorHelper(this),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var r = _step9.value;
          if (low >= r[0] && high <= r[1]) return true;
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
      return false;
    }
  }, {
    key: Symbol.iterator,
    value: /*#__PURE__*/_regeneratorRuntime().mark(function value() {
      var next;
      return _regeneratorRuntime().wrap(function value$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            next = this._first;
          case 1:
            if (!next) {
              _context4.next = 8;
              break;
            }
            if (!next) {
              _context4.next = 5;
              break;
            }
            _context4.next = 5;
            return _toConsumableArray(next);
          case 5:
            next = next.next;
            _context4.next = 1;
            break;
          case 8:
          case "end":
            return _context4.stop();
        }
      }, value, this);
    })
  }]);
}();
var regex = {
  urls: /(https?:\/\/[^\s]+)/gi
};
function is_valid_url(str) {
  return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i.test(str);
}
function is_valid_rtmp_url(str) {
  return /^rtmps?\:\/\//i.test(str);
}
function is_valid_ip(str) {
  return /((^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$)|(^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$))/.test(str);
}
function is_uri(s) {
  return /^[a-z]{2,}\:\/\//.test(String(s));
}
function is_absolute_path(s) {
  return /^(?:[a-zA-Z]\:[\\/]|\/)/.test(String(s));
}
// includes subdomains
function domain_match(uri, domain) {
  try {
    uri = new URL(uri).hostname || uri;
  } catch (_unused3) {}
  return !!uri.match("^(?:[^:]+:\\/\\/)?(?:.+?.)?(".concat(escape_regex(domain), ")(?:/|$)"));
}
function capitalize(str) {
  return String(str).replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}
function kebabcase(str) {
  return String(str).replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, '-').toLowerCase();
}
function escape_regex(str) {
  return String(str).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function split_after_first_line(str) {
  var m = str.match(/(.+?)[\n\r]+/);
  return m ? [m[1], str.slice(m[0].length)] : [str, undefined];
}
/* str_to_js(str) {
	try { return JSON.parse(str); } catch (e) { }
	return str;
}, */
function is_numeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function zip() {
  for (var _len8 = arguments.length, its = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
    its[_key8] = arguments[_key8];
  }
  its = its.map(function (it) {
    return Array.isArray(it) ? it : _toConsumableArray(it);
  });
  return its[0].map(function (_, i) {
    return its.map(function (a) {
      return a[i];
    });
  });
}
/* export function zip(keys, values) {
	return keys.reduce(
		(obj, key, i)=>{
			obj[key] = values[i];
			return obj;
		}, {}
	);
} */
/** @template T @param {Iterable<T>} a @param {Iterable<T>} b @return {Set<T>} */
function set_union(a, b) {
  return new Set([].concat(_toConsumableArray(a), _toConsumableArray(b)));
}
/** @template T @param {Iterable<T>} a @param {Iterable<T>} b @return {Set<T>} */
function set_difference(a, b) {
  if (!(b instanceof Set)) b = new Set(b);
  return new Set(_toConsumableArray(a).filter(function (x) {
    return !b.has(x);
  }));
}
/** @template T @param {Iterable<T>} a @param {Iterable<T>} b @return {Set<T>} */
function set_intersection(a, b) {
  if (!(b instanceof Set)) b = new Set(b);
  return new Set(_toConsumableArray(a).filter(function (x) {
    return b.has(x);
  }));
}
function sets_equal() {
  for (var _len9 = arguments.length, sets = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
    sets[_key9] = arguments[_key9];
  }
  var seta = sets[0];
  if (!(seta instanceof Set)) seta = new Set(seta);
  var _iterator10 = _createForOfIteratorHelper(sets.slice(1)),
    _step10;
  try {
    for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
      var setb = _step10.value;
      if (!(setb instanceof Set)) setb = new Set(setb);
      if (seta.size !== setb.size) return false;
      var _iterator11 = _createForOfIteratorHelper(seta),
        _step11;
      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var a = _step11.value;
          if (!setb.has(a)) return false;
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }
    }
  } catch (err) {
    _iterator10.e(err);
  } finally {
    _iterator10.f();
  }
  return true;
}
function debounce(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var timeout, previous, args, result, context;
  var _later = function later() {
    var passed = Date.now() - previous;
    if (wait > passed) {
      timeout = setTimeout(_later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
      if (!timeout) args = context = null;
    }
  };
  var debounced = function debounced() {
    context = this;
    for (var _len10 = arguments.length, p = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      p[_key10] = arguments[_key10];
    }
    args = p;
    previous = Date.now();
    if (!timeout) {
      timeout = setTimeout(_later, wait);
      if (immediate) result = func.apply(context, args);
    }
    return result;
  };
  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = args = context = null;
  };
  return debounced;
}
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};
  var later = function later() {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  var throttled = function throttled() {
    var _now = now();
    if (!previous && options.leading === false) previous = _now;
    var remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };
  return throttled;
}
function almost_equal(a, b) {
  var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : FLT_EPSILON;
  var d = Math.abs(a - b);
  return d <= epsilon;
}
/* sync_objects(src, dst) {
	var dst_keys = new Set(Object.keys(dst));
	for (var k in src) {
		dst_keys.delete(k);
		if (dst[k] !== src[k]) dst[k] = src[k];
	}
	for (var k of dst_keys) {
		delete dst[k];
	}
}, */
function sanitize_filename(name) {
  return String(name).toLowerCase().replace(/^\W+/, "").replace(/\W+$/, "").replace(/\W+/g, "-").trim().slice(0, 128);
}
function remove_nulls(obj) {
  if (Array.isArray(obj)) {
    var i = obj.length;
    while (i--) {
      if (obj[i] == null) obj.splice(i, 1);
    }
  } else {
    for (var _i4 = 0, _Object$keys = Object.keys(obj); _i4 < _Object$keys.length; _i4++) {
      var k = _Object$keys[_i4];
      if (obj[k] == null) delete obj[k];
    }
  }
}
/** @template T @param {Iterable<T>} values @param {function(T):string} cb @return {Record<string,T[]>} */
function group_by(values, cb) {
  var groups = {};
  var _iterator12 = _createForOfIteratorHelper(values),
    _step12;
  try {
    for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
      var value = _step12.value;
      var key = cb(value);
      if (!groups[key]) groups[key] = [];
      groups[key].push(value);
    }
  } catch (err) {
    _iterator12.e(err);
  } finally {
    _iterator12.f();
  }
  return groups;
}
/** @template T, K @param {Iterable<T>} values @param {function(T):K} cb @return {Map<K,T[]>} */
function map_group_by(values, cb) {
  /** @type {Map<T,K[]>} */
  var groups = new Map();
  var _iterator13 = _createForOfIteratorHelper(values),
    _step13;
  try {
    for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
      var value = _step13.value;
      var key = cb(value);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(value);
    }
  } catch (err) {
    _iterator13.e(err);
  } finally {
    _iterator13.f();
  }
  return groups;
}
function is_path_remote(path_str) {
  return path_str.includes("://");
}
function transpose(array) {
  return array[0].map(function (_, c) {
    return array.map(function (row) {
      return row[c];
    });
  });
}
function format_bytes(bytes) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  decimals = Math.max(decimals, 0);
  var k = 1024;
  var sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
  var i = clamp(Math.floor(Math.log(bytes) / Math.log(k)), min, sizes.length - 1);
  if (!isFinite(i)) i = 0;
  return "".concat((bytes / Math.pow(k, i)).toFixed(decimals), " ").concat(sizes[i]);
}
/** @param {string} s */
function string_to_bytes(s) {
  var m = s.match(/[a-z]+/i);
  var num = parseFloat(s);
  var e = 1;
  var unit = m[0] || "";
  if (m = unit.match(/^ki(bi)?/i)) e = 1024;else if (m = unit.match(/^k(ilo)?/i)) e = 1000;else if (m = unit.match(/^mi(bi)?/i)) e = Math.pow(1024, 2);else if (m = unit.match(/^m(ega)?/i)) e = Math.pow(1000, 2);else if (m = unit.match(/^gi(bi)?/i)) e = Math.pow(1024, 3);else if (m = unit.match(/^g(iga)?/i)) e = Math.pow(1000, 3);else if (m = unit.match(/^ti(bi)?/i)) e = Math.pow(1024, 4);else if (m = unit.match(/^t(era)?/i)) e = Math.pow(1000, 4);else if (m = unit.match(/^pi(bi)?/i)) e = Math.pow(1024, 5);else if (m = unit.match(/^p(eta)?/i)) e = Math.pow(1000, 5);
  unit = unit.slice(m ? m[0].length : 0);
  if (unit.match(/^b(?!yte)/)) num /= 8;
  return num * e;
}
function is_ip_local(ip) {
  return ip === "127.0.0.1" || ip === "::1" || ip == "::ffff:127.0.0.1";
}
function date_to_string(date, options) {
  if (date === undefined) date = Date.now();
  options = Object.assign({
    date: true,
    time: true,
    delimiter: "-"
  }, options);
  date = new Date(date);
  var parts = date.toISOString().slice(0, -1).split("T");
  if (!options.time) parts.splice(1, 1);
  if (!options.date) parts.splice(0, 1);
  var str = parts.join("-").replace(/[^\d]+/g, options.delimiter);
  return str;
}
function uniquify(arr, resolver) {
  if (!resolver) resolver = function resolver(s, i, n) {
    return n > 1 ? "".concat(s, " [").concat(i + 1, "]") : "".concat(s);
  };
  var map = new Map();
  var _iterator14 = _createForOfIteratorHelper(arr),
    _step14;
  try {
    for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
      var e = _step14.value;
      if (map.has(e)) map.set(map.get(e) + 1);else map.set(e, 1);
    }
  } catch (err) {
    _iterator14.e(err);
  } finally {
    _iterator14.f();
  }
  return arr.map(function (e, i) {
    var n = map.get(e);
    return resolver.apply(null, [e, i, n]);
  });
}
function time_delta_readable(delta) {
  var time_formats = [[1, '1 second ago', '1 second from now'], [60, 'seconds', 1], [60 * 2, '1 minute ago', '1 minute from now'], [60 * 60, 'minutes', 60], [60 * 60 * 2, '1 hour ago', '1 hour from now'], [60 * 60 * 24, 'hours', 60 * 60], [60 * 60 * 24 * 2, 'Yesterday', 'Tomorrow'], [60 * 60 * 24 * 7, 'days', 60 * 60 * 24], [60 * 60 * 24 * 7 * 2, 'Last week', 'Next week'], [60 * 60 * 24 * 7 * 4, 'weeks', 60 * 60 * 24 * 7], [60 * 60 * 24 * 7 * 4 * 2, 'Last month', 'Next month'], [60 * 60 * 24 * 7 * 4 * 12, 'months', 60 * 60 * 24 * 30], [60 * 60 * 24 * 7 * 4 * 12 * 2, 'Last year', 'Next year'], [60 * 60 * 24 * 7 * 4 * 12 * 100, 'years', 60 * 60 * 24 * 365], [60 * 60 * 24 * 7 * 4 * 12 * 100 * 2, 'Last century', 'Next century'], [60 * 60 * 24 * 7 * 4 * 12 * 100 * 20, 'centuries', 60 * 60 * 24 * 365 * 100]];
  var seconds = Math.floor(delta / 1000);
  if (seconds == 0) return 'Just now';
  var _ref = seconds < 0 ? ["ago", 1] : ['from now', 2],
    _ref2 = _slicedToArray(_ref, 2),
    token = _ref2[0],
    i = _ref2[1];
  seconds = Math.abs(seconds);
  for (var _i5 = 0, _time_formats = time_formats; _i5 < _time_formats.length; _i5++) {
    var format = _time_formats[_i5];
    if (seconds >= format[0]) continue;
    return typeof format[2] === 'string' ? format[i] : "".concat(Math.floor(seconds / format[2]), " ").concat(format[1], " ").concat(token);
  }
  return time;
}
function time_diff_readable(from, to) {
  if (from && !to) {
    var _ref3 = [new Date(), from];
    from = _ref3[0];
    to = _ref3[1];
  }
  if (!from) from = new Date();
  if (!to) to = new Date();
  return time_delta_readable(to - from);
}
function split_path(path) {
  return path.split(path_separator_regex).filter(function (p) {
    return p;
  });
}
/* register_change(obj, name) {
	return (key,value) => {
		// if key is int, value an array element.
		if (typeof key === "number") {
			if (!obj[name]) obj[name] = [];
			obj[name].push(value);
		} else {
			if (!obj[name]) obj[name] = {};
			obj[name][key] = value;
		}
	}
}, */
function is_plain_object(obj) {
  return _typeof(obj) === 'object' && obj !== null && obj.constructor === Object && Object.prototype.toString.call(obj) === '[object Object]';
}
function websocket_ready(ws) {
  var is_open = ws ? ws.readyState === 1 : false;
  if (is_open) return Promise.resolve();
  return new Promise(function (resolve) {
    ws.on("open", function () {
      return resolve();
    });
  });
}
/* once(event_emitter, event){
	return new Promise(resolve=>{
		event_emitter.once(event, (...args)=>{
			resolve(...args);
		})
	})
}, */
/** @template T @param {Object.<string,T|PromiseLike<T>>} obj @returns {Object.<string,Promise<Awaited<T>[]>>}; */
function promise_all_object(_x) {
  return _promise_all_object.apply(this, arguments);
}
function _promise_all_object() {
  _promise_all_object = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(obj) {
    var new_obj;
    return _regeneratorRuntime().wrap(function _callee3$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          new_obj = {};
          _context6.next = 3;
          return Promise.all(Object.entries(obj).map(function (_ref8) {
            var _ref9 = _slicedToArray(_ref8, 2),
              k = _ref9[0],
              p = _ref9[1];
            return Promise.resolve(p).then(function (data) {
              return new_obj[k] = data;
            });
          }));
        case 3:
          return _context6.abrupt("return", new_obj);
        case 4:
        case "end":
          return _context6.stop();
      }
    }, _callee3);
  }));
  return _promise_all_object.apply(this, arguments);
}
function replace_all(str, search, replace) {
  return str.split(search).join(replace);
}
function shuffle(arra1) {
  var ctr = arra1.length,
    temp,
    index;
  while (ctr > 0) {
    index = Math.floor(Math.random() * ctr);
    ctr--;
    temp = arra1[ctr];
    arra1[ctr] = arra1[index];
    arra1[index] = temp;
  }
  return arra1;
}
function matchAll(s, re) {
  var matches = [],
    m = null;
  while (m = re.exec(s)) {
    matches.push(m);
  }
  return matches;
}
function promise_timeout(promise) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10000;
  if (typeof promise === "function") promise = new Promise(promise);
  if (!ms || ms <= 0) return promise;
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new TimeoutError("Timed out in ".concat(ms, "ms.")));
    }, ms);
    promise.then(resolve)["catch"](reject);
  });
}
function promise_wait_atleast(promise) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10000;
  return Promise.all([promise, timeout(ms)]).then(function (d) {
    return d[0];
  });
}
function promise_pool(array, iteratorFn) {
  var poolLimit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
  var i = 0;
  var ret = [];
  var executing = new Set();
  array = _toConsumableArray(array);
  var _enqueue = function enqueue() {
    if (i === array.length) {
      return Promise.resolve();
    }
    var item = array[i];
    var p = Promise.resolve().then(function () {
      return iteratorFn(item, i, array);
    });
    ret.push(p);
    var e = p.then(function () {
      return executing["delete"](e);
    });
    executing.add(e);
    var r = executing.size >= poolLimit ? Promise.race(executing) : Promise.resolve();
    i++;
    return r.then(function () {
      return _enqueue();
    });
  };
  return _enqueue().then(function () {
    return Promise.all(ret);
  });
}
function timeout(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return Promise.resolve();
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
function split_string(str, partLength) {
  var list = [];
  if (str !== "" && partLength > 0) {
    for (var i = 0; i < str.length; i += partLength) {
      list.push(str.substr(i, Math.min(partLength, str.length)));
    }
  }
  return list;
}
function remove_emojis(str) {
  return str.replace(emoji_regex, '');
}
function array_move_before(arr, from, to) {
  if (to > from) to--;
  if (from === to) return arr;
  return array_move(arr, from, to);
}
function array_move(arr, from, to) {
  from = clamp(from, 0, arr.length - 1);
  to = clamp(to, 0, arr.length - 1);
  arr.splice.apply(arr, [to, 0].concat(_toConsumableArray(arr.splice(from, 1))));
  return arr;
}
function remove_duplicates(arr) {
  var s = new Set();
  var new_arr = [];
  var _iterator15 = _createForOfIteratorHelper(arr),
    _step15;
  try {
    for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
      var i = _step15.value;
      if (s.has(i)) continue;
      s.add(i);
      new_arr.push(i);
    }
  } catch (err) {
    _iterator15.e(err);
  } finally {
    _iterator15.f();
  }
  return new_arr;
}
function timespan_str_to_seconds(str) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "hh:mm:ss";
  return timespan_str_to_ms(str, format) / 1000;
}
// will also handle decimal points (milliseconds)
function timespan_str_to_ms(str) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "hh:mm:ss";
  var multiply = 1;
  if (str.startsWith("-")) {
    multiply = -1;
    str = str.slice(1);
  }
  var parts = String(str).split(/:/);
  var format_parts = format.split(/:/);
  if (format_parts.length > parts.length) format_parts = format_parts.slice(-parts.length); // so if str = "10:00" and format = "hh:mm:ss", the assumed format will be "mm:ss"
  else parts = parts.slice(-format_parts.length);
  var ms = 0;
  for (var i = 0; i < parts.length; i++) {
    var v = parseFloat(parts[i]);
    var f = format_parts[i][0];
    if (!Number.isFinite(v)) v = 0; // handles NaN & Infinity
    if (f == "d") ms += v * 24 * 60 * 60 * 1000;else if (f == "h") ms += v * 60 * 60 * 1000;else if (f == "m") ms += v * 60 * 1000;else if (f == "s") ms += v * 1000;
  }
  return ms * multiply;
}
// ms
function ms_to_timespan_str(num) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "hh:mm:ss";
  var negative = num < 0;
  num = Math.abs(+num) || 0;
  var format_parts = format.split(/([^a-z])/i).filter(function (m) {
    return m;
  });
  var parts = [];
  for (var i = 0; i < format_parts.length; i++) {
    var p = format_parts[i];
    var divider = null;
    if (p.startsWith("d")) divider = 24 * 60 * 60 * 1000;else if (p.startsWith("h")) divider = 60 * 60 * 1000;else if (p.startsWith("m")) divider = 60 * 1000;else if (p.startsWith("s")) divider = 1000;else if (p.startsWith("S")) divider = 1;else if (parts.length == 0) continue;
    if (p == "?") {
      if (parts[parts.length - 1] == 0) parts.pop();
      continue;
    }
    if (divider) {
      var v = Math.floor(num / divider);
      p = v.toString().padStart(p.length, "0");
      num -= v * divider;
    }
    parts.push(p);
  }
  return (negative ? "-" : "") + parts.join("");
}
function seconds_to_timespan_str(num) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "hh:mm:ss";
  return ms_to_timespan_str(num * 1000, format);
}
// ms
function ms_to_shorthand_str(num) {
  var show_ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var negative = num < 0;
  num = Math.abs(+num) || 0;
  var parts = [];
  for (var k in DIVIDERS) {
    var divider = DIVIDERS[k];
    var d = Math.floor(num / divider);
    num -= d * divider;
    if (k == "s" && show_ms) {
      d = (d + num / 1000).toFixed(+show_ms);
    }
    if (d) parts.push("".concat(d).concat(k));
  }
  return (negative ? "-" : "") + parts.join(" ");
}
function seconds_to_human_readable_str(t) {
  return ms_to_human_readable_str(t * 1000);
}
function ms_to_human_readable_str(t) {
  var days = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var hours = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var minutes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var seconds = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var o = {};
  if (days) o["Day"] = 1000 * 60 * 60 * 24;
  if (hours) o["Hour"] = 1000 * 60 * 60;
  if (minutes) o["Minute"] = 1000 * 60;
  if (seconds) o["Second"] = 1000;
  var parts = [];
  for (var k in o) {
    var v = Math.floor(t / o[k]);
    if (v) parts.push("".concat(v.toLocaleString(), " ").concat(k).concat(v > 1 ? "s" : ""));
    t -= v * o[k];
  }
  return parts.join(" ") || "0 Seconds";
}
function array_remove(arr, item) {
  var index = arr.indexOf(item);
  if (index === -1) return false;
  arr.splice(index, 1);
  return true;
}
function array_unique(arr) {
  return Array.from(iterate_unique(arr));
}
function iterate_unique(arr) {
  var seen, _iterator16, _step16, a;
  return _regeneratorRuntime().wrap(function iterate_unique$(_context5) {
    while (1) switch (_context5.prev = _context5.next) {
      case 0:
        seen = new Set();
        _iterator16 = _createForOfIteratorHelper(arr);
        _context5.prev = 2;
        _iterator16.s();
      case 4:
        if ((_step16 = _iterator16.n()).done) {
          _context5.next = 13;
          break;
        }
        a = _step16.value;
        if (!seen.has(a)) {
          _context5.next = 8;
          break;
        }
        return _context5.abrupt("continue", 11);
      case 8:
        seen.add(a);
        _context5.next = 11;
        return a;
      case 11:
        _context5.next = 4;
        break;
      case 13:
        _context5.next = 18;
        break;
      case 15:
        _context5.prev = 15;
        _context5.t0 = _context5["catch"](2);
        _iterator16.e(_context5.t0);
      case 18:
        _context5.prev = 18;
        _iterator16.f();
        return _context5.finish(18);
      case 21:
      case "end":
        return _context5.stop();
    }
  }, _marked, null, [[2, 15, 18, 21]]);
}
function random(min, max) {
  // min and max included
  return Math.random() * (max - min) + min;
}
function random_int(min, max) {
  // min and max included
  min = ~~min;
  max = ~~max;
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function array_repeat(d, n) {
  // min and max included
  var arr = [];
  while (n-- > 0) arr.push(d);
  return arr;
}
function random_string(length) {
  var chars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = new Array(length),
    num_chars = chars.length;
  for (var i = length; i > 0; --i) result[i] = chars[Math.floor(Math.random() * num_chars)];
  return result.join("");
}
function random_hex_string(length) {
  return random_string(length, "0123456789abcdef");
}
/* random_string(length) {
	[...Array(length)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
}, */
function is_empty(obj) {
  if (!obj) return true;
  if (_typeof(obj) !== "object") return false;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
function filter_object(obj, filter_callback) {
  var in_place = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (in_place) {
    for (var _i6 = 0, _Object$keys2 = Object.keys(obj); _i6 < _Object$keys2.length; _i6++) {
      var k = _Object$keys2[_i6];
      if (!filter_callback(k, obj[k])) delete obj[k];
    }
    return obj;
  } else {
    var new_obj = {};
    for (var _i7 = 0, _Object$keys3 = Object.keys(obj); _i7 < _Object$keys3.length; _i7++) {
      var k = _Object$keys3[_i7];
      if (filter_callback(k, obj[k])) new_obj[k] = obj[k];
    }
    return new_obj;
  }
}
function array_equals(arr1, arr2) {
  var length = arr1.length;
  if (length !== arr2.length) return false;
  for (var i = 0; i < length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
function all_equal(array) {
  if (array.length <= 1) return true;
  for (var i = 1; i < array.length; i++) {
    if (array[0] !== array[i]) return false;
  }
  return true;
}
/** @template T1 @param {function():T1} cb @param {*} [default_value] @returns {T1} */
function _try(cb) {
  var default_value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  try {
    return cb();
  } catch (_unused4) {
    return default_value;
  }
}
function clear(obj) {
  if (Array.isArray(obj)) {
    obj.splice(0, obj.length);
  } else if (_typeof(obj) === "object") {
    for (var _i8 = 0, _Object$keys4 = Object.keys(obj); _i8 < _Object$keys4.length; _i8++) {
      var k = _Object$keys4[_i8];
      delete obj[k];
    }
  }
}
function round_to_factor(num) {
  var f = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;
  return Math.round(num / f) * f;
}
function ceil_to_factor(num) {
  var f = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;
  return Math.ceil(num / f) * f;
}
function floor_to_factor(num) {
  var f = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;
  return Math.floor(num / f) * f;
}
function round_precise(num) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var m = Math.pow(10, precision);
  return Math.round(num * m) / m;
}
function clamp(a) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return Math.min(max, Math.max(min, a));
}
function lerp(x, y, a) {
  return x * (1 - a) + y * a;
}
function invlerp(x, y, a) {
  return clamp((a - x) / (y - x));
}
function range(x1, y1, x2, y2, a) {
  return lerp(x2, y2, invlerp(x1, y1, a));
}
function loop(num, min, max) {
  var len = max - min;
  num = min + (len != 0 ? (num - min) % len : 0);
  if (num < min) num += len;
  return num;
}
function log(n, base) {
  return Math.log(n) / (base ? Math.log(base) : 1);
}
/** @param {Iterable<number>} iterable */
function sum(iterable) {
  var total = 0.0;
  var _iterator17 = _createForOfIteratorHelper(iterable),
    _step17;
  try {
    for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
      var num = _step17.value;
      total += num;
    }
  } catch (err) {
    _iterator17.e(err);
  } finally {
    _iterator17.f();
  }
  return total;
}
/** @param {Iterable<number>} iterable */
function average(iterable) {
  var total = 0,
    n = 0;
  var _iterator18 = _createForOfIteratorHelper(iterable),
    _step18;
  try {
    for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
      var num = _step18.value;
      total += num;
      n++;
    }
  } catch (err) {
    _iterator18.e(err);
  } finally {
    _iterator18.f();
  }
  return total / n;
}
/** @param {Iterable<number>} iterable */
function get_best(iterable, cb) {
  var best_item = undefined,
    best_value = undefined,
    i = 0;
  var _iterator19 = _createForOfIteratorHelper(iterable),
    _step19;
  try {
    for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
      var item = _step19.value;
      var curr_value = cb(item);
      if (i == 0 || curr_value > best_item) {
        best_item = item;
        best_value = curr_value;
      }
      i++;
    }
  } catch (err) {
    _iterator19.e(err);
  } finally {
    _iterator19.f();
  }
  return best_item;
}
function key_count(ob) {
  var i = 0;
  for (var k in ob) i++;
  return i;
}
/** @template T @param {Record<string,T>} ob @param {number} max_size  @returns {T[]} */
function trim_object(ob, max_size) {
  var result = [];
  var num_keys = key_count(ob);
  for (var k in ob) {
    if (num_keys <= max_size) break;
    result.push(ob[k]);
    delete ob[k];
    num_keys--;
  }
  return result;
}
/**
 * @template T
 * @param {T[]} arr
 * @param {...(function(T):number)} cbs
*/
function sort(arr) {
  for (var _len11 = arguments.length, cbs = new Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
    cbs[_key11 - 1] = arguments[_key11];
  }
  if (!cbs.length) cbs = [function (v) {
    return v;
  }];
  return arr.sort(function (a, b) {
    for (var _i9 = 0, _cbs = cbs; _i9 < _cbs.length; _i9++) {
      var cb = _cbs[_i9];
      var av = cb(a),
        bv = cb(b);
      if (!Array.isArray(av)) av = [av, "ASCENDING"];
      if (!Array.isArray(bv)) bv = [bv, "ASCENDING"];
      var m = 1;
      if (av[1] === "ASCENDING") m = 1;else if (av[1] === "DESCENDING") m = -1;else throw new Error();
      if (av[0] < bv[0]) return -1 * m;
      if (av[0] > bv[0]) return 1 * m;
    }
    return 0;
  });
}
function set_add(set, vals) {
  var _iterator20 = _createForOfIteratorHelper(vals),
    _step20;
  try {
    for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
      var v = _step20.value;
      set.add(v);
    }
  } catch (err) {
    _iterator20.e(err);
  } finally {
    _iterator20.f();
  }
}
/* best(values, getter, comparator) {
	var max, best;
	for (var v of values) {
		var a = getter(v);
		if (comparator(a, max)) {
			best = v;
			max = a
		}
	}
	return best;
},
min(values, cb) {
	var min=Number.MAX_VALUE, best;
	for (var v of values) {
		var a = cb(v);
		if (a < min) {
			best = v;
			min = a
		}
	}
	return best;
},
max(values, cb) {
	var max=Number.MIN_VALUE, best;
	for (var v of values) {
		var a = cb(v);
		if (a > max) {
			best = v;
			max = a
		}
	}
	return best;
}, */
function num_to_str(num) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
var Ease = {
  // no easing, no acceleration
  linear: function linear(t) {
    return t;
  },
  // accelerating from zero velocity
  inQuad: function inQuad(t) {
    return t * t;
  },
  // decelerating to zero velocity
  outQuad: function outQuad(t) {
    return t * (2 - t);
  },
  // acceleration until halfway, then deceleration
  inOutQuad: function inOutQuad(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  // accelerating from zero velocity 
  inCubic: function inCubic(t) {
    return t * t * t;
  },
  // decelerating to zero velocity 
  outCubic: function outCubic(t) {
    return --t * t * t + 1;
  },
  // acceleration until halfway, then deceleration 
  inOutCubic: function inOutCubic(t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  // accelerating from zero velocity 
  inQuart: function inQuart(t) {
    return t * t * t * t;
  },
  // decelerating to zero velocity 
  outQuart: function outQuart(t) {
    return 1 - --t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  inOutQuart: function inOutQuart(t) {
    return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  // accelerating from zero velocity
  inQuint: function inQuint(t) {
    return t * t * t * t * t;
  },
  // decelerating to zero velocity
  outQuint: function outQuint(t) {
    return 1 + --t * t * t * t * t;
  },
  // acceleration until halfway, then deceleration 
  inOutQuint: function inOutQuint(t) {
    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  }
};
function remove_trailing_slash(filename) {
  return String(filename).replace(/[\/\\]+$/, "");
}
function dirname(filename) {
  filename = String(filename);
  filename = remove_trailing_slash(filename);
  return filename.substring(0, filename.length - basename(filename).length - 1);
}
function basename(filename) {
  filename = String(filename);
  return remove_trailing_slash(filename).split(path_separator_regex).pop();
}
function split_ext(filename) {
  filename = String(filename);
  var i = filename.lastIndexOf(".");
  if (i == -1) return [filename, ""];
  return [filename.substr(0, i), filename.slice(i)];
}
function join_paths() {
  for (var _len12 = arguments.length, paths = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
    paths[_key12] = arguments[_key12];
  }
  var last = paths.pop();
  return [].concat(_toConsumableArray(paths.map(function (f) {
    return remove_trailing_slash(f);
  })), [last]).join("/");
}
function relative_path(source, target) {
  var target_parts = String(target).split(path_separator_regex);
  var source_parts = String(source).split(path_separator_regex);
  if (array_equals(target_parts, source_parts)) {
    return ".";
  }
  var filename = target_parts.pop();
  var target_path = target_parts.join("/");
  var relative_parts = [];
  while (target_path.indexOf(source_parts.join("/")) === -1) {
    relative_parts.push("..");
    source_parts.pop();
  }
  relative_parts.push.apply(relative_parts, _toConsumableArray(target_parts.slice(source_parts.length)).concat([filename]));
  return relative_parts.join("/");
}
function split_datetime(date) {
  var apply_timezone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return function (date) {
    var date = +new Date(date);
    if (apply_timezone) date += -(+new Date(date).getTimezoneOffset() * 60 * 1000);
    var parts = new Date(date).toISOString().slice(0, -1).split("T");
    if (parts[0][0] == "+") parts[0] = parts[0].slice(1);
    return parts;
  }(date);
}
function join_datetime(parts) {
  var apply_timezone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var date = +new Date("".concat(parts.join(" "), "Z"));
  if (apply_timezone) date += +new Date(date).getTimezoneOffset() * 60 * 1000;
  return new Date(date);
}
function get_property_descriptor(obj, property) {
  while (obj) {
    var d = Object.getOwnPropertyDescriptor(obj, property);
    if (d) return d;
    obj = Object.getPrototypeOf(obj);
  }
  return null;
}
/** @return {string[]} */
function get_property_keys(obj) {
  var proto = Object.getPrototypeOf(obj);
  var inherited = proto ? get_property_keys(proto) : [];
  var seen = new Set(inherited);
  return [].concat(_toConsumableArray(inherited), _toConsumableArray(Object.getOwnPropertyNames(obj).filter(function (k) {
    return !seen.has(k);
  })));
}
/* *walk(o, children_delegate) {
	for (var c of children_delegate.apply(o, [o])) {
		yield c;
		var children = walk(c,children_delegate)
		if (children && Symbol.iterator in children) {
			for (var sc of children) {
				yield sc;
			}
		}
	}
}, */
/** @template T @param {T} o @param {function(T):Iterable<T>} children_cb */
function flatten_tree(o, children_cb) {
  /** @type {T[]} */
  var result = [];
  var _next3 = function next(o) {
    result.push(o);
    var children = children_cb.apply(o, [o]);
    if (!children || !(Symbol.iterator in children)) return;
    var _iterator21 = _createForOfIteratorHelper(children),
      _step21;
    try {
      for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
        var c = _step21.value;
        _next3(c);
      }
    } catch (err) {
      _iterator21.e(err);
    } finally {
      _iterator21.f();
    }
  };
  _next3(o);
  return result;
}
/** @template T @param {T} obj @param {Function(any):any} replacer @return {T} */
function deep_copy(obj, replacer) {
  if (_typeof(obj) !== 'object' || obj === null) return obj;
  return JSON.parse(replacer ? JSON.stringify(obj, replacer) : JSON.stringify(obj));
}
function deep_filter(obj, cb) {
  var new_obj = Array.isArray(obj) ? [] : {};
  for (var _i10 = 0, _Object$keys5 = Object.keys(obj); _i10 < _Object$keys5.length; _i10++) {
    var k = _Object$keys5[_i10];
    if (_typeof(obj[k]) === "object" && obj[k] !== null) new_obj[k] = deep_filter(obj[k], cb);else if (cb.apply(obj, [k, obj[k]])) new_obj[k] = obj[k];
  }
  return new_obj;
}
function deep_merge(dst, src) {
  var delete_nulls = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var info = {
    changes: 0
  };
  var _deep_merge = function deep_merge(dst, src) {
    var is_array = Array.isArray(src);
    for (var k in src) {
      if (_typeof(src[k]) === 'object' && src[k] !== null) {
        if (_typeof(dst[k]) !== "object" || dst[k] === null) {
          dst[k] = Array.isArray(src[k]) ? [] : {};
          info.changes++;
        }
        _deep_merge(dst[k], src[k]);
      } else {
        if (dst[k] !== src[k]) info.changes++;
        if (!is_array && delete_nulls && src[k] === null) delete dst[k];else dst[k] = src[k];
      }
    }
    if (is_array) dst.length = src.length;
  };
  _deep_merge(dst, src);
  return info;
}
function deep_assign(o1) {
  if (_typeof(o1) !== "object") throw new Error("deep_assign requires Object as first argument");
  for (var _len13 = arguments.length, objects = new Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
    objects[_key13 - 1] = arguments[_key13];
  }
  for (var _i11 = 0, _objects = objects; _i11 < _objects.length; _i11++) {
    var o2 = _objects[_i11];
    deep_merge(o1, o2);
  }
  return o1;
}
// syncs 2 objects to become identical, everything besides key order.
function deep_sync(dst, src) {
  var dst_keys = Object.keys(dst);
  for (var k in src) {
    if (src[k] === dst[k]) continue;
    if (src[k] !== null && dst[k] !== null && _typeof(src[k]) === 'object' && _typeof(dst[k]) === 'object' && Array.isArray(src[k]) == Array.isArray(dst[k])) {
      deep_sync(dst[k], src[k]);
    } else {
      dst[k] = deep_copy(src[k]);
    }
  }
  if (Array.isArray(src)) dst.length = src.length;
  for (var _i12 = 0, _dst_keys = dst_keys; _i12 < _dst_keys.length; _i12++) {
    var k = _dst_keys[_i12];
    if (!(k in src)) delete dst[k];
  }
}
/* deep_diff(o1, o2) {
	var changes = [];
	function _deep_diff(o1,o2,path) {
		if (typeof o1 !== "object" || typeof o2 !== "object") {
			var type;
			if (o1 === o2) return;
			else if (o1 === undefined) type = "created";
			else if (o2 === undefined) type = "deleted";
			else type = "changed";
			changes.push({
				path,
				type,
				old_value: o1,
				new_value: o2,
			});
		} else {
			for (var key in o1) {
				_deep_diff(o1[key], o2[key], [...path, key]);
			}
			for (var key in o2) {
				if (o1[key] === undefined) _deep_diff(undefined, o2[key], [...path, key]);
			}
		}
	}
	_deep_diff(o1,o2,[]);
	return changes;
}, */
function deep_equals(o1, o2) {
  var t1 = _typeof(o1);
  var t2 = _typeof(o2);
  if (t1 === "object" && t2 === "object" && o1 !== null && o2 !== null) {
    for (var k in o1) {
      if (!deep_equals(o1[k], o2[k])) return false;
    }
    for (var k in o2) {
      if (!(k in o1)) return false;
    }
    return true;
  } else {
    if (t1 == "number" && t2 == "number" && isNaN(o1) && isNaN(o2)) return true;
    if (o1 === o2) return true;
    return false;
  }
}
/* deep_equals(a, b) {
	if (a === b) return true;
	var [a_type,b_type] = [typeof a, typeof b];
	if (a_type !== b_type) return false;
	if (a_type === 'number' && isNaN(a) && isNaN(b)) return true;
	if (a_type !== "object") return a === b;
	var [a_keys,b_keys] = [Object.keys(a),Object.keys(b)];
	if (a_keys.length !== b_keys.length) return false;
	if (!a_keys.every((key)=>b.hasOwnProperty(key))) return false;
	return a_keys.every((key)=>deep_equals(a[key], b[key]));
}, */
function deep_diff(o1, o2) {
  function _deep_diff(o1, o2) {
    if (_typeof(o1) === "object" && _typeof(o2) === "object" && o1 !== null && o2 !== null) {
      var diff = {},
        diffs = 0;
      for (var k in o1) {
        var d = _deep_diff(o1[k], o2[k]);
        if (d) {
          diff[k] = d;
          diffs++;
        }
      }
      for (var k in o2) {
        if (k in o1) continue;
        var d = _deep_diff(undefined, o2[k]);
        if (d) {
          diff[k] = d;
          diffs++;
        }
      }
      if (diffs) {
        return diff;
      }
    } else {
      if (deep_equals(o1, o2)) return;
      return new Diff(o1, o2);
    }
  }
  return _deep_diff(o1, o2) || {};
}

// flattens tree like object structure to list of paths and values
function deep_entries(o) {
  var only_values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (o == null) throw new Error("Cannot convert undefined or null to object");
  var entries = [];
  var _walk = function walk(o, path) {
    if (_typeof(o) === "object" && o !== null) {
      if (!only_values && path.length) entries.push([path, o]);
      for (var k in o) {
        var new_path = [].concat(_toConsumableArray(path), [k]);
        if (filter && !filter.apply(o, [k, o[k], new_path])) {
          entries.push([new_path, o[k]]);
          continue;
        }
        _walk(o[k], new_path);
      }
    } else {
      entries.push([path, o]);
    }
  };
  _walk(o, []);
  return entries;
}
function deep_keys(o) {
  var only_values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return deep_entries(o, only_values, filter).map(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
      k = _ref5[0];
      _ref5[1];
    return k;
  });
}
function deep_values(o) {
  var only_values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return deep_entries(o, only_values, filter).map(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 2);
      _ref7[0];
      var v = _ref7[1];
    return v;
  });
}
function pathed_key_to_lookup(key, value) {
  var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var path = typeof key === "string" ? key.split("/") : _toConsumableArray(key);
  var curr = target;
  for (var i = 0; i < path.length - 1; i++) {
    var p = path[i];
    if (_typeof(curr[p]) !== "object" || curr[p] === null) curr[p] = {};
    curr = curr[p];
  }
  curr[path[path.length - 1]] = value;
  return target;
}
function tree_from_entries(entries) {
  var root = {};
  if (!Array.isArray(entries)) entries = [entries];
  var _iterator22 = _createForOfIteratorHelper(entries),
    _step22;
  try {
    for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
      var c = _step22.value;
      if (Array.isArray(c)) {
        deep_merge(root, pathed_key_to_lookup(c[0], c[1]));
      } else {
        for (var k in c) {
          deep_merge(root, pathed_key_to_lookup(k, c[k]));
        }
      }
    }
  } catch (err) {
    _iterator22.e(err);
  } finally {
    _iterator22.f();
  }
  return root;
}
/** @typedef {[id:any,pid:any]} TreeCallbackResult */
/** @template T @typedef {{value:T,children:TreeNode<T>[]}} TreeNode<T> */
/** @template T @param {T[]} list @param {function(T):TreeCallbackResult} cb */
function tree(list, cb) {
  var nodes = {},
    /** @type {TreeCallbackResult[]} */infos = [],
    /** @type {TreeNode<T>[]} */root_nodes = [];
  var i;
  for (i = 0; i < list.length; i++) {
    var info = infos[i] = cb(list[i]);
    nodes[info[0]] = {
      value: list[i],
      children: []
    };
  }
  for (i = 0; i < list.length; i++) {
    var info = infos[i];
    var node = nodes[info[0]];
    var parent_node = nodes[info[1]];
    if (parent_node) {
      parent_node.children.push(node);
    } else {
      root_nodes.push(node);
    }
  }
  return root_nodes;
}
function deep_map(o, cb) {
  if (_typeof(o) !== "object" || o === null) return;
  var new_o = {};
  for (var k in o) {
    if (_typeof(o[k]) === "object" && o[k] !== null) {
      new_o[k] = deep_map(o[k], cb);
    } else {
      new_o[k] = cb.apply(o, [k, o[k]]);
    }
  }
  return new_o;
}
function deep_walk(o, delegate_filter) {
  var _deep_walk = function deep_walk(o, delegate_filter, path) {
    if (_typeof(o) !== "object" || o === null) return;
    for (var k in o) {
      if (delegate_filter && delegate_filter.apply(o, [k, o[k], [].concat(_toConsumableArray(path), [k])]) === false) continue;
      _deep_walk(o[k], delegate_filter, [].concat(_toConsumableArray(path), [k]));
    }
  };
  _deep_walk(o, delegate_filter, []);
}
function replace_async(_x2, _x3, _x4) {
  return _replace_async.apply(this, arguments);
}
function _replace_async() {
  _replace_async = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(str, re, callback) {
    var parts, i, m, args, strings;
    return _regeneratorRuntime().wrap(function _callee4$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          str = String(str);
          parts = [], i = 0;
          if (!(re instanceof RegExp)) {
            _context7.next = 15;
            break;
          }
          if (re.global) re.lastIndex = i;
        case 4:
          if (!(m = re.exec(str))) {
            _context7.next = 13;
            break;
          }
          args = m.concat([m.index, m.input]);
          parts.push(str.slice(i, m.index), callback.apply(null, args));
          i = re.lastIndex;
          if (re.global) {
            _context7.next = 10;
            break;
          }
          return _context7.abrupt("break", 13);
        case 10:
          // for non-global regexes only take the first match
          if (m[0].length == 0) re.lastIndex++;
          _context7.next = 4;
          break;
        case 13:
          _context7.next = 19;
          break;
        case 15:
          re = String(re);
          i = str.indexOf(re);
          parts.push(str.slice(0, i), callback.apply(null, [re, i, str]));
          i += re.length;
        case 19:
          parts.push(str.slice(i));
          _context7.next = 22;
          return Promise.all(parts);
        case 22:
          strings = _context7.sent;
          return _context7.abrupt("return", strings.join(""));
        case 24:
        case "end":
          return _context7.stop();
      }
    }, _callee4);
  }));
  return _replace_async.apply(this, arguments);
}
function get(fn_this, fn_path) {
  // if (typeof fn_path === "string") fn_path = fn_path.split(/\./);
  if (!Array.isArray(fn_path)) fn_path = [fn_path];
  var fn_ref = fn_this;
  try {
    var _iterator23 = _createForOfIteratorHelper(fn_path),
      _step23;
    try {
      for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
        var fn_part = _step23.value;
        fn_this = fn_ref;
        var descriptor = get_property_descriptor(fn_ref, fn_part);
        if (descriptor && descriptor.get) fn_ref = descriptor.get.call(fn_this);else fn_ref = fn_ref[fn_part];
        // fn_ref = descriptor ? (descriptor.get ? descriptor.get.call(fn_this) : descriptor.value) : undefined;
      }
    } catch (err) {
      _iterator23.e(err);
    } finally {
      _iterator23.f();
    }
  } catch (_unused5) {
    throw new RefException("".concat(fn_this, " -> ").concat(fn_path));
  }
  return fn_ref;
}
function set(fn_this, fn_path, fn_value) {
  // if (typeof fn_path === "string") fn_path = fn_path.split(/\./);
  if (!Array.isArray(fn_path)) fn_path = [fn_path];
  var fn_ref = get(fn_this, fn_path.slice(0, -1));
  var prop = fn_path.slice(-1)[0];
  var descriptor = get_property_descriptor(fn_ref, prop);
  if (descriptor && descriptor.set) descriptor.set.call(fn_this, [fn_value]);else fn_ref[prop] = fn_value;
  return true;
}
function _delete(fn_this, fn_path) {
  // if (typeof fn_path === "string") fn_path = fn_path.split(/\./);
  if (!Array.isArray(fn_path)) fn_path = [fn_path];
  try {
    var fn_ref = get(fn_this, fn_path.slice(0, -1));
    var prop = fn_path.slice(-1)[0];
    delete fn_ref[prop];
  } catch (_unused6) {}
}
function call(fn_this, fn_path, fn_args) {
  var args = Array.prototype.slice.call(arguments);
  // if (typeof fn_path === "string") fn_path = fn_path.split(/\./);
  if (!Array.isArray(fn_path)) fn_path = [fn_path];
  if (!Array.isArray(fn_args)) fn_args = [fn_args];
  var fn_this = get(fn_this, fn_path.slice(0, -1));
  var fn_ref = get(fn_this, fn_path.slice(-1));
  if (fn_ref) {
    return fn_ref.apply(fn_this, fn_args);
  } else {
    throw new RefException("Bad call ref: ".concat(args.join(", ")));
  }
}
function build_url() {
  var config, url;
  for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
    args[_key14] = arguments[_key14];
  }
  if (args.length == 1) {
    config = args[0];
  } else {
    url = args[0];
    config = args[1];
  }
  url = String(url || (typeof window !== "undefined" && window.location ? window.location.origin : null) || "https://localhost");
  var protocol = url.match(/^([^:]+:)?\/\//)[0];
  url = "https://" + url.slice(protocol.length);
  if (config.protocol) protocol = config.protocol;
  var url_ob = new URL(url);
  for (var k in config) url_ob[k] = config[k];
  url = url_ob.toString();
  if (url_ob.protocol != protocol) url = url.replace("https:", protocol);
  return url;
}
function eval_string(str, ctx) {
  var f = function f(m) {
    return eval("this." + m);
  };
  return str.replace(/\{\{\s*(.+?)\s*\}\}/g, function (_, m) {
    return f.call(ctx, [m]);
  });
}
function path_to_file_uri(path) {
  if (!path.startsWith("/")) path = "/" + path;
  return new URL("file://" + path).toString();
}
function file_uri_to_path(uri) {
  if (typeof uri !== 'string' || uri.substring(0, 7) !== 'file://') {
    throw new TypeError('Must pass in a file:// URI to convert to a file path');
  }
  var rest = decodeURI(uri.substring(7));
  var firstSlash = rest.indexOf('/');
  var host = rest.substring(0, firstSlash);
  var path = rest.substring(firstSlash + 1);
  if (host === 'localhost') host = '';
  if (host) host = "//" + host;
  path = path.replace(/^(.+)\|/, '$1:');
  // path = path.replace(/\//g, '\\');
  // if not windows path...
  if (!/^.+:/.test(path)) {
    path = "/" + path;
  }
  return host + path;
}
function try_file_uri_to_path(uri) {
  try {
    return file_uri_to_path(uri);
  } catch (e) {
    return uri;
  }
}
/* get_random_values(array) {
	for (let i = 0, l = array.length; i < l; i++) {
			array[i] = Math.floor(Math.random() * 256);
	}
	return array;
}, */
function convert_links_to_html(str) {
  return str.replace(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim, '<a href="$1" target="_blank">$1</a>');
}
function convert_bytes(num) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  num = Math.abs(num);
  var divider = 1;
  for (var _i13 = 0, _arr2 = ["bytes", "KB", "MB", "GB", "TB", "PB"]; _i13 < _arr2.length; _i13++) {
    x = _arr2[_i13];
    if (num / divider < 1024.0) break;
    divider *= 1024.0;
  }
  return "".concat((num / divider).toFixed(precision), " ").concat(x);
}
function get_default_stream(streams, type) {
  var index_map = new Map();
  streams.forEach(function (s, i) {
    return index_map.set(s, i);
  });
  if (type === "subtitle") streams = streams.filter(function (s) {
    return s["default"] || s.forced;
  });
  return sort(_toConsumableArray(streams), function (s) {
    return +s.forced;
  }, function (s) {
    return +s["default"];
  }, function (s) {
    return -index_map.get(s);
  }).pop();
}

/* fmod(a,b) {
	return Number((a - (Math.floor(a / b) * b)));
} */

// the following junk prevents node 16.13.0 + vs code crashing when I start the debugger (weird but true)
// a:1,
// b:1,
// c:1,
var _cache = /*#__PURE__*/new WeakMap();
var _limit = /*#__PURE__*/new WeakMap();
var _n = /*#__PURE__*/new WeakMap();
var Cache = /*#__PURE__*/function () {
  function Cache() {
    var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    _classCallCheck(this, Cache);
    _classPrivateFieldInitSpec(this, _cache, {});
    _classPrivateFieldInitSpec(this, _limit, 0);
    _classPrivateFieldInitSpec(this, _n, 0);
    _classPrivateFieldSet2(_limit, this, limit);
  }
  return _createClass(Cache, [{
    key: "has",
    value: function has(key) {
      return key in _classPrivateFieldGet2(_cache, this);
    }
  }, {
    key: "get",
    value: function get(key) {
      return _classPrivateFieldGet2(_cache, this)[key];
    }
  }, {
    key: "set",
    value: function set(key, value) {
      var _this$n3;
      if (key in _classPrivateFieldGet2(_cache, this)) {
        var _this$n;
        delete _classPrivateFieldGet2(_cache, this)[key];
        _classPrivateFieldSet2(_n, this, (_this$n = _classPrivateFieldGet2(_n, this), _this$n--, _this$n));
      }
      _classPrivateFieldGet2(_cache, this)[key] = value;
      _classPrivateFieldSet2(_n, this, (_this$n3 = _classPrivateFieldGet2(_n, this), _this$n3++, _this$n3));
      if (_classPrivateFieldGet2(_limit, this) > 0) {
        for (var k in _classPrivateFieldGet2(_cache, this)) {
          var _this$n5;
          if (_classPrivateFieldGet2(_n, this) <= _classPrivateFieldGet2(_limit, this)) break;
          delete _classPrivateFieldGet2(_cache, this)[k];
          _classPrivateFieldSet2(_n, this, (_this$n5 = _classPrivateFieldGet2(_n, this), _this$n5--, _this$n5));
        }
      }
    }
  }]);
}();
function nearest(num) {
  var minDiff = Number.MAX_VALUE;
  for (var _len15 = arguments.length, values = new Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
    values[_key15 - 1] = arguments[_key15];
  }
  for (var _i14 = 0, _values = values; _i14 < _values.length; _i14++) {
    var val = _values[_i14];
    var m = Math.abs(num - values[i]);
    if (m < minDiff) {
      minDiff = m;
      curr = val;
    }
  }
  return curr;
}
function truncate(str, len) {
  var suffix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  str = String(str);
  if (str.length > len) str = str.slice(0, len) + suffix;
  return str;
}

/** @returns {Promise & {resolve:function(any):void, reject:function(any):void}} */
function deferred() {
  var resolve, reject;
  var prom = new Promise(function (_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });
  prom.resolve = resolve;
  prom.reject = reject;
  return prom;
}
function fix_url(_url) {
  _url = String(_url).trim();
  var url;
  try {
    url = new URL(url);
    if (!url.hostname) url = new URL("https://" + _url);
  } catch (_unused7) {
    try {
      url = new URL("https://" + _url);
    } catch (_unused8) {
      return;
    }
  }
  return url.toString();
}

exports.Cache = Cache;
exports.Color = Color;
exports.Ease = Ease;
exports.EventEmitter = EventEmitter;
exports.Interval = Interval;
exports.Observer = Observer;
exports.OrderedSet = OrderedSet;
exports.Point = Point;
exports.PromisePool = PromisePool;
exports.RangeTree = RangeTree;
exports.Rectangle = Rectangle;
exports.RefException = RefException;
exports.StopWatch = StopWatch;
exports.TimeoutError = TimeoutError;
exports.Timer = Timer;
exports.URLParams = URLParams;
exports.all_equal = all_equal;
exports.almost_equal = almost_equal;
exports.array_equals = array_equals;
exports.array_move = array_move;
exports.array_move_before = array_move_before;
exports.array_remove = array_remove;
exports.array_repeat = array_repeat;
exports.array_unique = array_unique;
exports.average = average;
exports.basename = basename;
exports.build_url = build_url;
exports.call = call;
exports.capitalize = capitalize;
exports.ceil_to_factor = ceil_to_factor;
exports.clamp = clamp;
exports.clear = clear;
exports.convert_bytes = convert_bytes;
exports.convert_links_to_html = convert_links_to_html;
exports.date_to_string = date_to_string;
exports.debounce = debounce;
exports.deep_assign = deep_assign;
exports.deep_copy = deep_copy;
exports.deep_diff = deep_diff;
exports.deep_entries = deep_entries;
exports.deep_equals = deep_equals;
exports.deep_filter = deep_filter;
exports.deep_keys = deep_keys;
exports.deep_map = deep_map;
exports.deep_merge = deep_merge;
exports.deep_sync = deep_sync;
exports.deep_values = deep_values;
exports.deep_walk = deep_walk;
exports.deferred = deferred;
exports.delete = _delete;
exports.dirname = dirname;
exports.domain_match = domain_match;
exports.emoji_regex = emoji_regex;
exports.escape_regex = escape_regex;
exports.eval_string = eval_string;
exports.file_uri_to_path = file_uri_to_path;
exports.filter_object = filter_object;
exports.fix_url = fix_url;
exports.flatten_tree = flatten_tree;
exports.floor_to_factor = floor_to_factor;
exports.format_bytes = format_bytes;
exports.get = get;
exports.get_best = get_best;
exports.get_default_stream = get_default_stream;
exports.get_property_descriptor = get_property_descriptor;
exports.get_property_keys = get_property_keys;
exports.group_by = group_by;
exports.invlerp = invlerp;
exports.is_absolute_path = is_absolute_path;
exports.is_empty = is_empty;
exports.is_ip_local = is_ip_local;
exports.is_numeric = is_numeric;
exports.is_path_remote = is_path_remote;
exports.is_plain_object = is_plain_object;
exports.is_uri = is_uri;
exports.is_valid_ip = is_valid_ip;
exports.is_valid_rtmp_url = is_valid_rtmp_url;
exports.is_valid_url = is_valid_url;
exports.iterate_unique = iterate_unique;
exports.join_datetime = join_datetime;
exports.join_paths = join_paths;
exports.kebabcase = kebabcase;
exports.key_count = key_count;
exports.lerp = lerp;
exports.log = log;
exports.loop = loop;
exports.map_group_by = map_group_by;
exports.matchAll = matchAll;
exports.md5 = libExports.md5;
exports.ms_to_human_readable_str = ms_to_human_readable_str;
exports.ms_to_shorthand_str = ms_to_shorthand_str;
exports.ms_to_timespan_str = ms_to_timespan_str;
exports.nearest = nearest;
exports.num_to_str = num_to_str;
exports.options_proxy = options_proxy;
exports.path_separator_regex = path_separator_regex;
exports.path_to_file_uri = path_to_file_uri;
exports.pathed_key_to_lookup = pathed_key_to_lookup;
exports.promise_all_object = promise_all_object;
exports.promise_pool = promise_pool;
exports.promise_timeout = promise_timeout;
exports.promise_wait_atleast = promise_wait_atleast;
exports.random = random;
exports.random_hex_string = random_hex_string;
exports.random_int = random_int;
exports.random_string = random_string;
exports.range = range;
exports.regex = regex;
exports.relative_path = relative_path;
exports.remove_duplicates = remove_duplicates;
exports.remove_emojis = remove_emojis;
exports.remove_nulls = remove_nulls;
exports.remove_trailing_slash = remove_trailing_slash;
exports.replace_all = replace_all;
exports.replace_async = replace_async;
exports.round_precise = round_precise;
exports.round_to_factor = round_to_factor;
exports.sanitize_filename = sanitize_filename;
exports.seconds_to_human_readable_str = seconds_to_human_readable_str;
exports.seconds_to_timespan_str = seconds_to_timespan_str;
exports.set = set;
exports.set_add = set_add;
exports.set_difference = set_difference;
exports.set_intersection = set_intersection;
exports.set_union = set_union;
exports.sets_equal = sets_equal;
exports.shuffle = shuffle;
exports.sort = sort;
exports.split_after_first_line = split_after_first_line;
exports.split_datetime = split_datetime;
exports.split_ext = split_ext;
exports.split_path = split_path;
exports.split_string = split_string;
exports.string_to_bytes = string_to_bytes;
exports.sum = sum;
exports.throttle = throttle;
exports.time_delta_readable = time_delta_readable;
exports.time_diff_readable = time_diff_readable;
exports.timeout = timeout;
exports.timespan_str_to_ms = timespan_str_to_ms;
exports.timespan_str_to_seconds = timespan_str_to_seconds;
exports.transpose = transpose;
exports.tree = tree;
exports.tree_from_entries = tree_from_entries;
exports.trim_object = trim_object;
exports.truncate = truncate;
exports.try = _try;
exports.try_file_uri_to_path = try_file_uri_to_path;
exports.uniquify = uniquify;
exports.websocket_ready = websocket_ready;
exports.zip = zip;
//# sourceMappingURL=index.cjs.map
