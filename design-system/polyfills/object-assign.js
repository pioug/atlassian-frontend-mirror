/* eslint-disable */
'function' != typeof Object.assign &&
  (Object.assign = function(n, t) {
    'use strict';
    if (null == n)
      throw new TypeError('Cannot convert undefined or null to object');
    for (var r = Object(n), e = 1; e < arguments.length; e++) {
      var o = arguments[e];
      if (null != o)
        for (var c in o)
          Object.prototype.hasOwnProperty.call(o, c) && (r[c] = o[c]);
    }
    return r;
  });
