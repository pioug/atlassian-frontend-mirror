"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewingConditions = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var math = _interopRequireWildcard(require("./math-utils"));
var _whitePointD = require("./white-point-d65");
var _yFromLstar = require("./y-from-lstar");
var _ViewingConditions;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
var ViewingConditions = exports.ViewingConditions = /*#__PURE__*/function () {
  function ViewingConditions(n, aw, nbb, ncb, c, nc, rgbD, fl, fLRoot, z) {
    (0, _classCallCheck2.default)(this, ViewingConditions);
    this.n = n;
    this.aw = aw;
    this.nbb = nbb;
    this.ncb = ncb;
    this.c = c;
    this.nc = nc;
    this.rgbD = rgbD;
    this.fl = fl;
    this.fLRoot = fLRoot;
    this.z = z;
  }
  return (0, _createClass2.default)(ViewingConditions, null, [{
    key: "make",
    value:
    /**
     * Create ViewingConditions from a simple, physically relevant, set of
     * parameters.
     *
     * @param whitePoint White point, measured in the XYZ color space.
     *     default = D65, or sunny day afternoon
     * @param adaptingLuminance The luminance of the adapting field. Informally,
     *     how bright it is in the room where the color is viewed. Can be
     *     calculated from lux by multiplying lux by 0.0586. default = 11.72,
     *     or 200 lux.
     * @param backgroundLstar The lightness of the area surrounding the color.
     *     measured by L* in L*a*b*. default = 50.0
     * @param surround A general description of the lighting surrounding the
     *     color. 0 is pitch dark, like watching a movie in a theater. 1.0 is a
     *     dimly light room, like watching TV at home at night. 2.0 means there
     *     is no difference between the lighting on the color and around it.
     *     default = 2.0
     * @param discountingIlluminant Whether the eye accounts for the tint of the
     *     ambient lighting, such as knowing an apple is still red in green light.
     *     default = false, the eye does not perform this process on
     *       self-luminous objects like displays.
     */
    function make() {
      var whitePoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _whitePointD.whitePointD65)();
      var adaptingLuminance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200.0 / Math.PI * (0, _yFromLstar.yFromLstar)(50.0) / 100.0;
      var backgroundLstar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 50.0;
      var surround = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2.0;
      var discountingIlluminant = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var xyz = whitePoint;
      var rW = xyz[0] * 0.401288 + xyz[1] * 0.650173 + xyz[2] * -0.051461;
      var gW = xyz[0] * -0.250268 + xyz[1] * 1.204414 + xyz[2] * 0.045854;
      var bW = xyz[0] * -0.002079 + xyz[1] * 0.048952 + xyz[2] * 0.953127;
      var f = 0.8 + surround / 10.0;
      var c = f >= 0.9 ? math.lerp(0.59, 0.69, (f - 0.9) * 10.0) : math.lerp(0.525, 0.59, (f - 0.8) * 10.0);
      var d = discountingIlluminant ? 1.0 : f * (1.0 - 1.0 / 3.6 * Math.exp((-adaptingLuminance - 42.0) / 92.0));
      d = d > 1.0 ? 1.0 : d < 0.0 ? 0.0 : d;
      var nc = f;
      var rgbD = [d * (100.0 / rW) + 1.0 - d, d * (100.0 / gW) + 1.0 - d, d * (100.0 / bW) + 1.0 - d];
      var k = 1.0 / (5.0 * adaptingLuminance + 1.0);
      var k4 = k * k * k * k;
      var k4F = 1.0 - k4;
      var fl = k4 * adaptingLuminance + 0.1 * k4F * k4F * Math.cbrt(5.0 * adaptingLuminance);
      var n = (0, _yFromLstar.yFromLstar)(backgroundLstar) / whitePoint[1];
      var z = 1.48 + Math.sqrt(n);
      var nbb = 0.725 / Math.pow(n, 0.2);
      var ncb = nbb;
      var rgbAFactors = [Math.pow(fl * rgbD[0] * rW / 100.0, 0.42), Math.pow(fl * rgbD[1] * gW / 100.0, 0.42), Math.pow(fl * rgbD[2] * bW / 100.0, 0.42)];
      var rgbA = [400.0 * rgbAFactors[0] / (rgbAFactors[0] + 27.13), 400.0 * rgbAFactors[1] / (rgbAFactors[1] + 27.13), 400.0 * rgbAFactors[2] / (rgbAFactors[2] + 27.13)];
      var aw = (2.0 * rgbA[0] + rgbA[1] + 0.05 * rgbA[2]) * nbb;
      return new ViewingConditions(n, aw, nbb, ncb, c, nc, rgbD, fl, Math.pow(fl, 0.25), z);
    }

    /**
     * Parameters are intermediate values of the CAM16 conversion process. Their
     * names are shorthand for technical color science terminology, this class
     * would not benefit from documenting them individually. A brief overview
     * is available in the CAM16 specification, and a complete overview requires
     * a color science textbook, such as Fairchild's Color Appearance Models.
     */
  }]);
}();
_ViewingConditions = ViewingConditions;
/**
 * sRGB-like viewing conditions.
 */
(0, _defineProperty2.default)(ViewingConditions, "DEFAULT", _ViewingConditions.make());