"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "clampDouble", {
  enumerable: true,
  get: function get() {
    return _clampDouble.clampDouble;
  }
});
Object.defineProperty(exports, "clampInt", {
  enumerable: true,
  get: function get() {
    return _clampInt.clampInt;
  }
});
Object.defineProperty(exports, "lerp", {
  enumerable: true,
  get: function get() {
    return _lerp.lerp;
  }
});
Object.defineProperty(exports, "matrixMultiply", {
  enumerable: true,
  get: function get() {
    return _matrixMultiply.matrixMultiply;
  }
});
Object.defineProperty(exports, "sanitizeDegreesDouble", {
  enumerable: true,
  get: function get() {
    return _sanitizeDegreesDouble.sanitizeDegreesDouble;
  }
});
Object.defineProperty(exports, "signum", {
  enumerable: true,
  get: function get() {
    return _signum.signum;
  }
});
var _signum = require("./signum");
var _lerp = require("./lerp");
var _clampInt = require("./clamp-int");
var _clampDouble = require("./clamp-double");
var _sanitizeDegreesDouble = require("./sanitize-degrees-double");
var _matrixMultiply = require("./matrix-multiply");