"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewingConditions = exports.Hct = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var utils = _interopRequireWildcard(require("./color-utils"));
var math = _interopRequireWildcard(require("./math-utils"));
var _class2;
/**
 * Below lines are copied from @material/material-color-utilities.
 * Do not modify it.
 */
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * A color system built using CAM16 hue and chroma, and L* from
 * L*a*b*.
 *
 * Using L* creates a link between the color system, contrast, and thus
 * accessibility. Contrast ratio depends on relative luminance, or Y in the XYZ
 * color space. L*, or perceptual luminance can be calculated from Y.
 *
 * Unlike Y, L* is linear to human perception, allowing trivial creation of
 * accurate color tones.
 *
 * Unlike contrast ratio, measuring contrast in L* is linear, and simple to
 * calculate. A difference of 40 in HCT tone guarantees a contrast ratio >= 3.0,
 * and a difference of 50 guarantees a contrast ratio >= 4.5.
 */
/**
 * HCT, hue, chroma, and tone. A color system that provides a perceptually
 * accurate color measurement system that can also accurately render what colors
 * will appear as in different lighting environments.
 */
var Hct = exports.Hct = /*#__PURE__*/function () {
  function Hct(argb) {
    (0, _classCallCheck2.default)(this, Hct);
    this.argb = argb;
    var cam = Cam16.fromInt(argb);
    this.internalHue = cam.hue;
    this.internalChroma = cam.chroma;
    this.internalTone = utils.lstarFromArgb(argb);
    this.argb = argb;
  }
  (0, _createClass2.default)(Hct, [{
    key: "toInt",
    value: function toInt() {
      return this.argb;
    }

    /**
     * A number, in degrees, representing ex. red, orange, yellow, etc.
     * Ranges from 0 <= hue < 360.
     */
  }, {
    key: "hue",
    get: function get() {
      return this.internalHue;
    }

    /**
     * @param newHue 0 <= newHue < 360; invalid values are corrected.
     * Chroma may decrease because chroma has a different maximum for any given
     * hue and tone.
     */,
    set: function set(newHue) {
      this.setInternalState(HctSolver.solveToInt(newHue, this.internalChroma, this.internalTone));
    }
  }, {
    key: "chroma",
    get: function get() {
      return this.internalChroma;
    }

    /**
     * @param newChroma 0 <= newChroma < ?
     * Chroma may decrease because chroma has a different maximum for any given
     * hue and tone.
     */,
    set: function set(newChroma) {
      this.setInternalState(HctSolver.solveToInt(this.internalHue, newChroma, this.internalTone));
    }

    /**
     * Lightness. Ranges from 0 to 100.
     */
  }, {
    key: "tone",
    get: function get() {
      return this.internalTone;
    }

    /**
     * @param newTone 0 <= newTone <= 100; invalid valids are corrected.
     * Chroma may decrease because chroma has a different maximum for any given
     * hue and tone.
     */,
    set: function set(newTone) {
      this.setInternalState(HctSolver.solveToInt(this.internalHue, this.internalChroma, newTone));
    }
  }, {
    key: "setInternalState",
    value: function setInternalState(argb) {
      var cam = Cam16.fromInt(argb);
      this.internalHue = cam.hue;
      this.internalChroma = cam.chroma;
      this.internalTone = utils.lstarFromArgb(argb);
      this.argb = argb;
    }

    /**
     * Translates a color into different [ViewingConditions].
     *
     * Colors change appearance. They look different with lights on versus off,
     * the same color, as in hex code, on white looks different when on black.
     * This is called color relativity, most famously explicated by Josef Albers
     * in Interaction of Color.
     *
     * In color science, color appearance models can account for this and
     * calculate the appearance of a color in different settings. HCT is based on
     * CAM16, a color appearance model, and uses it to make these calculations.
     *
     * See [ViewingConditions.make] for parameters affecting color appearance.
     */
  }, {
    key: "inViewingConditions",
    value: function inViewingConditions(vc) {
      // 1. Use CAM16 to find XYZ coordinates of color in specified VC.
      var cam = Cam16.fromInt(this.toInt());
      var viewedInVc = cam.xyzInViewingConditions(vc);

      // 2. Create CAM16 of those XYZ coordinates in default VC.
      var recastInVc = Cam16.fromXyzInViewingConditions(viewedInVc[0], viewedInVc[1], viewedInVc[2], ViewingConditions.make());

      // 3. Create HCT from:
      // - CAM16 using default VC with XYZ coordinates in specified VC.
      // - L* converted from Y in XYZ coordinates in specified VC.
      var recastHct = Hct.from(recastInVc.hue, recastInVc.chroma, utils.lstarFromY(viewedInVc[1]));
      return recastHct;
    }
  }], [{
    key: "from",
    value:
    /**
     * @param hue 0 <= hue < 360; invalid values are corrected.
     * @param chroma 0 <= chroma < ?; Informally, colorfulness. The color
     *     returned may be lower than the requested chroma. Chroma has a different
     *     maximum for any given hue and tone.
     * @param tone 0 <= tone <= 100; invalid values are corrected.
     * @return HCT representation of a color in default viewing conditions.
     */

    function from(hue, chroma, tone) {
      return new Hct(HctSolver.solveToInt(hue, chroma, tone));
    }

    /**
     * @param argb ARGB representation of a color.
     * @return HCT representation of a color in default viewing conditions
     */
  }, {
    key: "fromInt",
    value: function fromInt(argb) {
      return new Hct(argb);
    }
  }]);
  return Hct;
}();
/**
 * CAM16, a color appearance model. Colors are not just defined by their hex
 * code, but rather, a hex code and viewing conditions.
 *
 * CAM16 instances also have coordinates in the CAM16-UCS space, called J*, a*,
 * b*, or jstar, astar, bstar in code. CAM16-UCS is included in the CAM16
 * specification, and should be used when measuring distances between colors.
 *
 * In traditional color spaces, a color can be identified solely by the
 * observer's measurement of the color. Color appearance models such as CAM16
 * also use information about the environment where the color was
 * observed, known as the viewing conditions.
 *
 * For example, white under the traditional assumption of a midday sun white
 * point is accurately measured as a slightly chromatic blue by CAM16. (roughly,
 * hue 203, chroma 3, lightness 100)
 */
var Cam16 = /*#__PURE__*/function () {
  /**
   * All of the CAM16 dimensions can be calculated from 3 of the dimensions, in
   * the following combinations:
   *      -  {j or q} and {c, m, or s} and hue
   *      - jstar, astar, bstar
   * Prefer using a static method that constructs from 3 of those dimensions.
   * This constructor is intended for those methods to use to return all
   * possible dimensions.
   *
   * @param hue
   * @param chroma informally, colorfulness / color intensity. like saturation
   *     in HSL, except perceptually accurate.
   * @param j lightness
   * @param q brightness; ratio of lightness to white point's lightness
   * @param m colorfulness
   * @param s saturation; ratio of chroma to white point's chroma
   * @param jstar CAM16-UCS J coordinate
   * @param astar CAM16-UCS a coordinate
   * @param bstar CAM16-UCS b coordinate
   */
  function Cam16(hue, chroma, j, q, m, s, jstar, astar, bstar) {
    (0, _classCallCheck2.default)(this, Cam16);
    this.hue = hue;
    this.chroma = chroma;
    this.j = j;
    this.q = q;
    this.m = m;
    this.s = s;
    this.jstar = jstar;
    this.astar = astar;
    this.bstar = bstar;
  }

  /**
   * CAM16 instances also have coordinates in the CAM16-UCS space, called J*,
   * a*, b*, or jstar, astar, bstar in code. CAM16-UCS is included in the CAM16
   * specification, and is used to measure distances between colors.
   */
  (0, _createClass2.default)(Cam16, [{
    key: "distance",
    value: function distance(other) {
      var dJ = this.jstar - other.jstar;
      var dA = this.astar - other.astar;
      var dB = this.bstar - other.bstar;
      var dEPrime = Math.sqrt(dJ * dJ + dA * dA + dB * dB);
      var dE = 1.41 * Math.pow(dEPrime, 0.63);
      return dE;
    }

    /**
     * @param argb ARGB representation of a color.
     * @return CAM16 color, assuming the color was viewed in default viewing
     *     conditions.
     */
  }, {
    key: "toInt",
    value:
    /**
     *  @return ARGB representation of color, assuming the color was viewed in
     *     default viewing conditions, which are near-identical to the default
     *     viewing conditions for sRGB.
     */
    function toInt() {
      return this.viewed(ViewingConditions.DEFAULT);
    }

    /**
     * @param viewingConditions Information about the environment where the color
     *     will be viewed.
     * @return ARGB representation of color
     */
  }, {
    key: "viewed",
    value: function viewed(viewingConditions) {
      var alpha = this.chroma === 0.0 || this.j === 0.0 ? 0.0 : this.chroma / Math.sqrt(this.j / 100.0);
      var t = Math.pow(alpha / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73), 1.0 / 0.9);
      var hRad = this.hue * Math.PI / 180.0;
      var eHue = 0.25 * (Math.cos(hRad + 2.0) + 3.8);
      var ac = viewingConditions.aw * Math.pow(this.j / 100.0, 1.0 / viewingConditions.c / viewingConditions.z);
      var p1 = eHue * (50000.0 / 13.0) * viewingConditions.nc * viewingConditions.ncb;
      var p2 = ac / viewingConditions.nbb;
      var hSin = Math.sin(hRad);
      var hCos = Math.cos(hRad);
      var gamma = 23.0 * (p2 + 0.305) * t / (23.0 * p1 + 11.0 * t * hCos + 108.0 * t * hSin);
      var a = gamma * hCos;
      var b = gamma * hSin;
      var rA = (460.0 * p2 + 451.0 * a + 288.0 * b) / 1403.0;
      var gA = (460.0 * p2 - 891.0 * a - 261.0 * b) / 1403.0;
      var bA = (460.0 * p2 - 220.0 * a - 6300.0 * b) / 1403.0;
      var rCBase = Math.max(0, 27.13 * Math.abs(rA) / (400.0 - Math.abs(rA)));
      var rC = math.signum(rA) * (100.0 / viewingConditions.fl) * Math.pow(rCBase, 1.0 / 0.42);
      var gCBase = Math.max(0, 27.13 * Math.abs(gA) / (400.0 - Math.abs(gA)));
      var gC = math.signum(gA) * (100.0 / viewingConditions.fl) * Math.pow(gCBase, 1.0 / 0.42);
      var bCBase = Math.max(0, 27.13 * Math.abs(bA) / (400.0 - Math.abs(bA)));
      var bC = math.signum(bA) * (100.0 / viewingConditions.fl) * Math.pow(bCBase, 1.0 / 0.42);
      var rF = rC / viewingConditions.rgbD[0];
      var gF = gC / viewingConditions.rgbD[1];
      var bF = bC / viewingConditions.rgbD[2];
      var x = 1.86206786 * rF - 1.01125463 * gF + 0.14918677 * bF;
      var y = 0.38752654 * rF + 0.62144744 * gF - 0.00897398 * bF;
      var z = -0.0158415 * rF - 0.03412294 * gF + 1.04996444 * bF;
      var argb = utils.argbFromXyz(x, y, z);
      return argb;
    }

    /// Given color expressed in XYZ and viewed in [viewingConditions], convert to
    /// CAM16.
  }, {
    key: "xyzInViewingConditions",
    value:
    /// XYZ representation of CAM16 seen in [viewingConditions].
    function xyzInViewingConditions(viewingConditions) {
      var alpha = this.chroma === 0.0 || this.j === 0.0 ? 0.0 : this.chroma / Math.sqrt(this.j / 100.0);
      var t = Math.pow(alpha / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73), 1.0 / 0.9);
      var hRad = this.hue * Math.PI / 180.0;
      var eHue = 0.25 * (Math.cos(hRad + 2.0) + 3.8);
      var ac = viewingConditions.aw * Math.pow(this.j / 100.0, 1.0 / viewingConditions.c / viewingConditions.z);
      var p1 = eHue * (50000.0 / 13.0) * viewingConditions.nc * viewingConditions.ncb;
      var p2 = ac / viewingConditions.nbb;
      var hSin = Math.sin(hRad);
      var hCos = Math.cos(hRad);
      var gamma = 23.0 * (p2 + 0.305) * t / (23.0 * p1 + 11 * t * hCos + 108.0 * t * hSin);
      var a = gamma * hCos;
      var b = gamma * hSin;
      var rA = (460.0 * p2 + 451.0 * a + 288.0 * b) / 1403.0;
      var gA = (460.0 * p2 - 891.0 * a - 261.0 * b) / 1403.0;
      var bA = (460.0 * p2 - 220.0 * a - 6300.0 * b) / 1403.0;
      var rCBase = Math.max(0, 27.13 * Math.abs(rA) / (400.0 - Math.abs(rA)));
      var rC = math.signum(rA) * (100.0 / viewingConditions.fl) * Math.pow(rCBase, 1.0 / 0.42);
      var gCBase = Math.max(0, 27.13 * Math.abs(gA) / (400.0 - Math.abs(gA)));
      var gC = math.signum(gA) * (100.0 / viewingConditions.fl) * Math.pow(gCBase, 1.0 / 0.42);
      var bCBase = Math.max(0, 27.13 * Math.abs(bA) / (400.0 - Math.abs(bA)));
      var bC = math.signum(bA) * (100.0 / viewingConditions.fl) * Math.pow(bCBase, 1.0 / 0.42);
      var rF = rC / viewingConditions.rgbD[0];
      var gF = gC / viewingConditions.rgbD[1];
      var bF = bC / viewingConditions.rgbD[2];
      var x = 1.86206786 * rF - 1.01125463 * gF + 0.14918677 * bF;
      var y = 0.38752654 * rF + 0.62144744 * gF - 0.00897398 * bF;
      var z = -0.0158415 * rF - 0.03412294 * gF + 1.04996444 * bF;
      return [x, y, z];
    }
  }], [{
    key: "fromInt",
    value: function fromInt(argb) {
      return Cam16.fromIntInViewingConditions(argb, ViewingConditions.DEFAULT);
    }

    /**
     * @param argb ARGB representation of a color.
     * @param viewingConditions Information about the environment where the color
     *     was observed.
     * @return CAM16 color.
     */
  }, {
    key: "fromIntInViewingConditions",
    value: function fromIntInViewingConditions(argb, viewingConditions) {
      var red = (argb & 0x00ff0000) >> 16;
      var green = (argb & 0x0000ff00) >> 8;
      var blue = argb & 0x000000ff;
      var redL = utils.linearized(red);
      var greenL = utils.linearized(green);
      var blueL = utils.linearized(blue);
      var x = 0.41233895 * redL + 0.35762064 * greenL + 0.18051042 * blueL;
      var y = 0.2126 * redL + 0.7152 * greenL + 0.0722 * blueL;
      var z = 0.01932141 * redL + 0.11916382 * greenL + 0.95034478 * blueL;
      var rC = 0.401288 * x + 0.650173 * y - 0.051461 * z;
      var gC = -0.250268 * x + 1.204414 * y + 0.045854 * z;
      var bC = -0.002079 * x + 0.048952 * y + 0.953127 * z;
      var rD = viewingConditions.rgbD[0] * rC;
      var gD = viewingConditions.rgbD[1] * gC;
      var bD = viewingConditions.rgbD[2] * bC;
      var rAF = Math.pow(viewingConditions.fl * Math.abs(rD) / 100.0, 0.42);
      var gAF = Math.pow(viewingConditions.fl * Math.abs(gD) / 100.0, 0.42);
      var bAF = Math.pow(viewingConditions.fl * Math.abs(bD) / 100.0, 0.42);
      var rA = math.signum(rD) * 400.0 * rAF / (rAF + 27.13);
      var gA = math.signum(gD) * 400.0 * gAF / (gAF + 27.13);
      var bA = math.signum(bD) * 400.0 * bAF / (bAF + 27.13);
      var a = (11.0 * rA + -12.0 * gA + bA) / 11.0;
      var b = (rA + gA - 2.0 * bA) / 9.0;
      var u = (20.0 * rA + 20.0 * gA + 21.0 * bA) / 20.0;
      var p2 = (40.0 * rA + 20.0 * gA + bA) / 20.0;
      var atan2 = Math.atan2(b, a);
      var atanDegrees = atan2 * 180.0 / Math.PI;
      var hue = atanDegrees < 0 ? atanDegrees + 360.0 : atanDegrees >= 360 ? atanDegrees - 360.0 : atanDegrees;
      var hueRadians = hue * Math.PI / 180.0;
      var ac = p2 * viewingConditions.nbb;
      var j = 100.0 * Math.pow(ac / viewingConditions.aw, viewingConditions.c * viewingConditions.z);
      var q = 4.0 / viewingConditions.c * Math.sqrt(j / 100.0) * (viewingConditions.aw + 4.0) * viewingConditions.fLRoot;
      var huePrime = hue < 20.14 ? hue + 360 : hue;
      var eHue = 0.25 * (Math.cos(huePrime * Math.PI / 180.0 + 2.0) + 3.8);
      var p1 = 50000.0 / 13.0 * eHue * viewingConditions.nc * viewingConditions.ncb;
      var t = p1 * Math.sqrt(a * a + b * b) / (u + 0.305);
      var alpha = Math.pow(t, 0.9) * Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
      var c = alpha * Math.sqrt(j / 100.0);
      var m = c * viewingConditions.fLRoot;
      var s = 50.0 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4.0));
      var jstar = (1.0 + 100.0 * 0.007) * j / (1.0 + 0.007 * j);
      var mstar = 1.0 / 0.0228 * Math.log(1.0 + 0.0228 * m);
      var astar = mstar * Math.cos(hueRadians);
      var bstar = mstar * Math.sin(hueRadians);
      return new Cam16(hue, c, j, q, m, s, jstar, astar, bstar);
    }

    /**
     * @param j CAM16 lightness
     * @param c CAM16 chroma
     * @param h CAM16 hue
     */
  }, {
    key: "fromJch",
    value: function fromJch(j, c, h) {
      return Cam16.fromJchInViewingConditions(j, c, h, ViewingConditions.DEFAULT);
    }

    /**
     * @param j CAM16 lightness
     * @param c CAM16 chroma
     * @param h CAM16 hue
     * @param viewingConditions Information about the environment where the color
     *     was observed.
     */
  }, {
    key: "fromJchInViewingConditions",
    value: function fromJchInViewingConditions(j, c, h, viewingConditions) {
      var q = 4.0 / viewingConditions.c * Math.sqrt(j / 100.0) * (viewingConditions.aw + 4.0) * viewingConditions.fLRoot;
      var m = c * viewingConditions.fLRoot;
      var alpha = c / Math.sqrt(j / 100.0);
      var s = 50.0 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4.0));
      var hueRadians = h * Math.PI / 180.0;
      var jstar = (1.0 + 100.0 * 0.007) * j / (1.0 + 0.007 * j);
      var mstar = 1.0 / 0.0228 * Math.log(1.0 + 0.0228 * m);
      var astar = mstar * Math.cos(hueRadians);
      var bstar = mstar * Math.sin(hueRadians);
      return new Cam16(h, c, j, q, m, s, jstar, astar, bstar);
    }

    /**
     * @param jstar CAM16-UCS lightness.
     * @param astar CAM16-UCS a dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the Y axis.
     * @param bstar CAM16-UCS b dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the X axis.
     */
  }, {
    key: "fromUcs",
    value: function fromUcs(jstar, astar, bstar) {
      return Cam16.fromUcsInViewingConditions(jstar, astar, bstar, ViewingConditions.DEFAULT);
    }

    /**
     * @param jstar CAM16-UCS lightness.
     * @param astar CAM16-UCS a dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the Y axis.
     * @param bstar CAM16-UCS b dimension. Like a* in L*a*b*, it is a Cartesian
     *     coordinate on the X axis.
     * @param viewingConditions Information about the environment where the color
     *     was observed.
     */
  }, {
    key: "fromUcsInViewingConditions",
    value: function fromUcsInViewingConditions(jstar, astar, bstar, viewingConditions) {
      var a = astar;
      var b = bstar;
      var m = Math.sqrt(a * a + b * b);
      var M = (Math.exp(m * 0.0228) - 1.0) / 0.0228;
      var c = M / viewingConditions.fLRoot;
      var h = Math.atan2(b, a) * (180.0 / Math.PI);
      if (h < 0.0) {
        h += 360.0;
      }
      var j = jstar / (1 - (jstar - 100) * 0.007);
      return Cam16.fromJchInViewingConditions(j, c, h, viewingConditions);
    }
  }, {
    key: "fromXyzInViewingConditions",
    value: function fromXyzInViewingConditions(x, y, z, viewingConditions) {
      // Transform XYZ to 'cone'/'rgb' responses

      var rC = 0.401288 * x + 0.650173 * y - 0.051461 * z;
      var gC = -0.250268 * x + 1.204414 * y + 0.045854 * z;
      var bC = -0.002079 * x + 0.048952 * y + 0.953127 * z;

      // Discount illuminant
      var rD = viewingConditions.rgbD[0] * rC;
      var gD = viewingConditions.rgbD[1] * gC;
      var bD = viewingConditions.rgbD[2] * bC;

      // chromatic adaptation
      var rAF = Math.pow(viewingConditions.fl * Math.abs(rD) / 100.0, 0.42);
      var gAF = Math.pow(viewingConditions.fl * Math.abs(gD) / 100.0, 0.42);
      var bAF = Math.pow(viewingConditions.fl * Math.abs(bD) / 100.0, 0.42);
      var rA = math.signum(rD) * 400.0 * rAF / (rAF + 27.13);
      var gA = math.signum(gD) * 400.0 * gAF / (gAF + 27.13);
      var bA = math.signum(bD) * 400.0 * bAF / (bAF + 27.13);

      // redness-greenness
      var a = (11.0 * rA + -12.0 * gA + bA) / 11.0;
      // yellowness-blueness
      var b = (rA + gA - 2.0 * bA) / 9.0;

      // auxiliary components
      var u = (20.0 * rA + 20.0 * gA + 21.0 * bA) / 20.0;
      var p2 = (40.0 * rA + 20.0 * gA + bA) / 20.0;

      // hue
      var atan2 = Math.atan2(b, a);
      var atanDegrees = atan2 * 180.0 / Math.PI;
      var hue = atanDegrees < 0 ? atanDegrees + 360.0 : atanDegrees >= 360 ? atanDegrees - 360 : atanDegrees;
      var hueRadians = hue * Math.PI / 180.0;

      // achromatic response to color
      var ac = p2 * viewingConditions.nbb;

      // CAM16 lightness and brightness
      var J = 100.0 * Math.pow(ac / viewingConditions.aw, viewingConditions.c * viewingConditions.z);
      var Q = 4.0 / viewingConditions.c * Math.sqrt(J / 100.0) * (viewingConditions.aw + 4.0) * viewingConditions.fLRoot;
      var huePrime = hue < 20.14 ? hue + 360 : hue;
      var eHue = 1.0 / 4.0 * (Math.cos(huePrime * Math.PI / 180.0 + 2.0) + 3.8);
      var p1 = 50000.0 / 13.0 * eHue * viewingConditions.nc * viewingConditions.ncb;
      var t = p1 * Math.sqrt(a * a + b * b) / (u + 0.305);
      var alpha = Math.pow(t, 0.9) * Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
      // CAM16 chroma, colorfulness, chroma
      var C = alpha * Math.sqrt(J / 100.0);
      var M = C * viewingConditions.fLRoot;
      var s = 50.0 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4.0));

      // CAM16-UCS components
      var jstar = (1.0 + 100.0 * 0.007) * J / (1.0 + 0.007 * J);
      var mstar = Math.log(1.0 + 0.0228 * M) / 0.0228;
      var astar = mstar * Math.cos(hueRadians);
      var bstar = mstar * Math.sin(hueRadians);
      return new Cam16(hue, C, J, Q, M, s, jstar, astar, bstar);
    }
  }]);
  return Cam16;
}(); // This file is automatically generated. Do not modify it.
// material_color_utilities is designed to have a consistent API across
// platforms and modular components that can be moved around easily. Using a
// class as a namespace facilitates this.
//
// tslint:disable:class-as-namespace
/**
 * A class that solves the HCT equation.
 */
var HctSolver = /*#__PURE__*/function () {
  function HctSolver() {
    (0, _classCallCheck2.default)(this, HctSolver);
  }
  (0, _createClass2.default)(HctSolver, null, [{
    key: "sanitizeRadians",
    value:
    /**
     * Sanitizes a small enough angle in radians.
     *
     * @param angle An angle in radians; must not deviate too much
     * from 0.
     * @return A coterminal angle between 0 and 2pi.
     */
    function sanitizeRadians(angle) {
      return (angle + Math.PI * 8) % (Math.PI * 2);
    }

    /**
     * Delinearizes an RGB component, returning a floating-point
     * number.
     *
     * @param rgbComponent 0.0 <= rgb_component <= 100.0, represents
     * linear R/G/B channel
     * @return 0.0 <= output <= 255.0, color channel converted to
     * regular RGB space
     */
  }, {
    key: "trueDelinearized",
    value: function trueDelinearized(rgbComponent) {
      var normalized = rgbComponent / 100.0;
      var delinearized = 0.0;
      if (normalized <= 0.0031308) {
        delinearized = normalized * 12.92;
      } else {
        delinearized = 1.055 * Math.pow(normalized, 1.0 / 2.4) - 0.055;
      }
      return delinearized * 255.0;
    }
  }, {
    key: "chromaticAdaptation",
    value: function chromaticAdaptation(component) {
      var af = Math.pow(Math.abs(component), 0.42);
      return math.signum(component) * 400.0 * af / (af + 27.13);
    }

    /**
     * Returns the hue of a linear RGB color in CAM16.
     *
     * @param linrgb The linear RGB coordinates of a color.
     * @return The hue of the color in CAM16, in radians.
     */
  }, {
    key: "hueOf",
    value: function hueOf(linrgb) {
      var scaledDiscount = math.matrixMultiply(linrgb, HctSolver.SCALED_DISCOUNT_FROM_LINRGB);
      var rA = HctSolver.chromaticAdaptation(scaledDiscount[0]);
      var gA = HctSolver.chromaticAdaptation(scaledDiscount[1]);
      var bA = HctSolver.chromaticAdaptation(scaledDiscount[2]);
      // redness-greenness
      var a = (11.0 * rA + -12.0 * gA + bA) / 11.0;
      // yellowness-blueness
      var b = (rA + gA - 2.0 * bA) / 9.0;
      return Math.atan2(b, a);
    }
  }, {
    key: "areInCyclicOrder",
    value: function areInCyclicOrder(a, b, c) {
      var deltaAB = HctSolver.sanitizeRadians(b - a);
      var deltaAC = HctSolver.sanitizeRadians(c - a);
      return deltaAB < deltaAC;
    }

    /**
     * Solves the lerp equation.
     *
     * @param source The starting number.
     * @param mid The number in the middle.
     * @param target The ending number.
     * @return A number t such that lerp(source, target, t) = mid.
     */
  }, {
    key: "intercept",
    value: function intercept(source, mid, target) {
      return (mid - source) / (target - source);
    }
  }, {
    key: "lerpPoint",
    value: function lerpPoint(source, t, target) {
      return [source[0] + (target[0] - source[0]) * t, source[1] + (target[1] - source[1]) * t, source[2] + (target[2] - source[2]) * t];
    }

    /**
     * Intersects a segment with a plane.
     *
     * @param source The coordinates of point A.
     * @param coordinate The R-, G-, or B-coordinate of the plane.
     * @param target The coordinates of point B.
     * @param axis The axis the plane is perpendicular with. (0: R, 1:
     * G, 2: B)
     * @return The intersection point of the segment AB with the plane
     * R=coordinate, G=coordinate, or B=coordinate
     */
  }, {
    key: "setCoordinate",
    value: function setCoordinate(source, coordinate, target, axis) {
      var t = HctSolver.intercept(source[axis], coordinate, target[axis]);
      return HctSolver.lerpPoint(source, t, target);
    }
  }, {
    key: "isBounded",
    value: function isBounded(x) {
      return 0.0 <= x && x <= 100.0;
    }

    /**
     * Returns the nth possible vertex of the polygonal intersection.
     *
     * @param y The Y value of the plane.
     * @param n The zero-based index of the point. 0 <= n <= 11.
     * @return The nth possible vertex of the polygonal intersection
     * of the y plane and the RGB cube, in linear RGB coordinates, if
     * it exists. If this possible vertex lies outside of the cube,
     * [-1.0, -1.0, -1.0] is returned.
     */
  }, {
    key: "nthVertex",
    value: function nthVertex(y, n) {
      var kR = HctSolver.Y_FROM_LINRGB[0];
      var kG = HctSolver.Y_FROM_LINRGB[1];
      var kB = HctSolver.Y_FROM_LINRGB[2];
      var coordA = n % 4 <= 1 ? 0.0 : 100.0;
      var coordB = n % 2 === 0 ? 0.0 : 100.0;
      if (n < 4) {
        var g = coordA;
        var b = coordB;
        var r = (y - g * kG - b * kB) / kR;
        if (HctSolver.isBounded(r)) {
          return [r, g, b];
        } else {
          return [-1.0, -1.0, -1.0];
        }
      } else if (n < 8) {
        var _b = coordA;
        var _r = coordB;
        var _g = (y - _r * kR - _b * kB) / kG;
        if (HctSolver.isBounded(_g)) {
          return [_r, _g, _b];
        } else {
          return [-1.0, -1.0, -1.0];
        }
      } else {
        var _r2 = coordA;
        var _g2 = coordB;
        var _b2 = (y - _r2 * kR - _g2 * kG) / kB;
        if (HctSolver.isBounded(_b2)) {
          return [_r2, _g2, _b2];
        } else {
          return [-1.0, -1.0, -1.0];
        }
      }
    }

    /**
     * Finds the segment containing the desired color.
     *
     * @param y The Y value of the color.
     * @param targetHue The hue of the color.
     * @return A list of two sets of linear RGB coordinates, each
     * corresponding to an endpoint of the segment containing the
     * desired color.
     */
  }, {
    key: "bisectToSegment",
    value: function bisectToSegment(y, targetHue) {
      var left = [-1.0, -1.0, -1.0];
      var right = left;
      var leftHue = 0.0;
      var rightHue = 0.0;
      var initialized = false;
      var uncut = true;
      for (var _n = 0; _n < 12; _n++) {
        var mid = HctSolver.nthVertex(y, _n);
        if (mid[0] < 0) {
          continue;
        }
        var midHue = HctSolver.hueOf(mid);
        if (!initialized) {
          left = mid;
          right = mid;
          leftHue = midHue;
          rightHue = midHue;
          initialized = true;
          continue;
        }
        if (uncut || HctSolver.areInCyclicOrder(leftHue, midHue, rightHue)) {
          uncut = false;
          if (HctSolver.areInCyclicOrder(leftHue, targetHue, midHue)) {
            right = mid;
            rightHue = midHue;
          } else {
            left = mid;
            leftHue = midHue;
          }
        }
      }
      return [left, right];
    }
  }, {
    key: "midpoint",
    value: function midpoint(a, b) {
      return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
    }
  }, {
    key: "criticalPlaneBelow",
    value: function criticalPlaneBelow(x) {
      return Math.floor(x - 0.5);
    }
  }, {
    key: "criticalPlaneAbove",
    value: function criticalPlaneAbove(x) {
      return Math.ceil(x - 0.5);
    }

    /**
     * Finds a color with the given Y and hue on the boundary of the
     * cube.
     *
     * @param y The Y value of the color.
     * @param targetHue The hue of the color.
     * @return The desired color, in linear RGB coordinates.
     */
  }, {
    key: "bisectToLimit",
    value: function bisectToLimit(y, targetHue) {
      var segment = HctSolver.bisectToSegment(y, targetHue);
      var left = segment[0];
      var leftHue = HctSolver.hueOf(left);
      var right = segment[1];
      for (var axis = 0; axis < 3; axis++) {
        if (left[axis] !== right[axis]) {
          var lPlane = -1;
          var rPlane = 255;
          if (left[axis] < right[axis]) {
            lPlane = HctSolver.criticalPlaneBelow(HctSolver.trueDelinearized(left[axis]));
            rPlane = HctSolver.criticalPlaneAbove(HctSolver.trueDelinearized(right[axis]));
          } else {
            lPlane = HctSolver.criticalPlaneAbove(HctSolver.trueDelinearized(left[axis]));
            rPlane = HctSolver.criticalPlaneBelow(HctSolver.trueDelinearized(right[axis]));
          }
          for (var i = 0; i < 8; i++) {
            if (Math.abs(rPlane - lPlane) <= 1) {
              break;
            } else {
              var mPlane = Math.floor((lPlane + rPlane) / 2.0);
              var midPlaneCoordinate = HctSolver.CRITICAL_PLANES[mPlane];
              var mid = HctSolver.setCoordinate(left, midPlaneCoordinate, right, axis);
              var midHue = HctSolver.hueOf(mid);
              if (HctSolver.areInCyclicOrder(leftHue, targetHue, midHue)) {
                right = mid;
                rPlane = mPlane;
              } else {
                left = mid;
                leftHue = midHue;
                lPlane = mPlane;
              }
            }
          }
        }
      }
      return HctSolver.midpoint(left, right);
    }
  }, {
    key: "inverseChromaticAdaptation",
    value: function inverseChromaticAdaptation(adapted) {
      var adaptedAbs = Math.abs(adapted);
      var base = Math.max(0, 27.13 * adaptedAbs / (400.0 - adaptedAbs));
      return math.signum(adapted) * Math.pow(base, 1.0 / 0.42);
    }

    /**
     * Finds a color with the given hue, chroma, and Y.
     *
     * @param hueRadians The desired hue in radians.
     * @param chroma The desired chroma.
     * @param y The desired Y.
     * @return The desired color as a hexadecimal integer, if found; 0
     * otherwise.
     */
  }, {
    key: "findResultByJ",
    value: function findResultByJ(hueRadians, chroma, y) {
      // Initial estimate of j.
      var j = Math.sqrt(y) * 11.0;
      // ===========================================================
      // Operations inlined from Cam16 to avoid repeated calculation
      // ===========================================================
      var viewingConditions = ViewingConditions.DEFAULT;
      var tInnerCoeff = 1 / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
      var eHue = 0.25 * (Math.cos(hueRadians + 2.0) + 3.8);
      var p1 = eHue * (50000.0 / 13.0) * viewingConditions.nc * viewingConditions.ncb;
      var hSin = Math.sin(hueRadians);
      var hCos = Math.cos(hueRadians);
      for (var iterationRound = 0; iterationRound < 5; iterationRound++) {
        // ===========================================================
        // Operations inlined from Cam16 to avoid repeated calculation
        // ===========================================================
        var jNormalized = j / 100.0;
        var alpha = chroma === 0.0 || j === 0.0 ? 0.0 : chroma / Math.sqrt(jNormalized);
        var t = Math.pow(alpha * tInnerCoeff, 1.0 / 0.9);
        var ac = viewingConditions.aw * Math.pow(jNormalized, 1.0 / viewingConditions.c / viewingConditions.z);
        var p2 = ac / viewingConditions.nbb;
        var gamma = 23.0 * (p2 + 0.305) * t / (23.0 * p1 + 11 * t * hCos + 108.0 * t * hSin);
        var a = gamma * hCos;
        var b = gamma * hSin;
        var rA = (460.0 * p2 + 451.0 * a + 288.0 * b) / 1403.0;
        var gA = (460.0 * p2 - 891.0 * a - 261.0 * b) / 1403.0;
        var bA = (460.0 * p2 - 220.0 * a - 6300.0 * b) / 1403.0;
        var rCScaled = HctSolver.inverseChromaticAdaptation(rA);
        var gCScaled = HctSolver.inverseChromaticAdaptation(gA);
        var bCScaled = HctSolver.inverseChromaticAdaptation(bA);
        var linrgb = math.matrixMultiply([rCScaled, gCScaled, bCScaled], HctSolver.LINRGB_FROM_SCALED_DISCOUNT);
        // ===========================================================
        // Operations inlined from Cam16 to avoid repeated calculation
        // ===========================================================
        if (linrgb[0] < 0 || linrgb[1] < 0 || linrgb[2] < 0) {
          return 0;
        }
        var kR = HctSolver.Y_FROM_LINRGB[0];
        var kG = HctSolver.Y_FROM_LINRGB[1];
        var kB = HctSolver.Y_FROM_LINRGB[2];
        var fnj = kR * linrgb[0] + kG * linrgb[1] + kB * linrgb[2];
        if (fnj <= 0) {
          return 0;
        }
        if (iterationRound === 4 || Math.abs(fnj - y) < 0.002) {
          if (linrgb[0] > 100.01 || linrgb[1] > 100.01 || linrgb[2] > 100.01) {
            return 0;
          }
          return utils.argbFromLinrgb(linrgb);
        }
        // Iterates with Newton method,
        // Using 2 * fn(j) / j as the approximation of fn'(j)
        j = j - (fnj - y) * j / (2 * fnj);
      }
      return 0;
    }

    /**
     * Finds an sRGB color with the given hue, chroma, and L*, if
     * possible.
     *
     * @param hueDegrees The desired hue, in degrees.
     * @param chroma The desired chroma.
     * @param lstar The desired L*.
     * @return A hexadecimal representing the sRGB color. The color
     * has sufficiently close hue, chroma, and L* to the desired
     * values, if possible; otherwise, the hue and L* will be
     * sufficiently close, and chroma will be maximized.
     */
  }, {
    key: "solveToInt",
    value: function solveToInt(hueDegrees, chroma, lstar) {
      if (chroma < 0.0001 || lstar < 0.0001 || lstar > 99.9999) {
        return utils.argbFromLstar(lstar);
      }
      hueDegrees = math.sanitizeDegreesDouble(hueDegrees);
      var hueRadians = hueDegrees / 180 * Math.PI;
      var y = utils.yFromLstar(lstar);
      var exactAnswer = HctSolver.findResultByJ(hueRadians, chroma, y);
      if (exactAnswer !== 0) {
        return exactAnswer;
      }
      var linrgb = HctSolver.bisectToLimit(y, hueRadians);
      return utils.argbFromLinrgb(linrgb);
    }

    /**
     * Finds an sRGB color with the given hue, chroma, and L*, if
     * possible.
     *
     * @param hueDegrees The desired hue, in degrees.
     * @param chroma The desired chroma.
     * @param lstar The desired L*.
     * @return An CAM16 object representing the sRGB color. The color
     * has sufficiently close hue, chroma, and L* to the desired
     * values, if possible; otherwise, the hue and L* will be
     * sufficiently close, and chroma will be maximized.
     */
  }, {
    key: "solveToCam",
    value: function solveToCam(hueDegrees, chroma, lstar) {
      return Cam16.fromInt(HctSolver.solveToInt(hueDegrees, chroma, lstar));
    }
  }]);
  return HctSolver;
}();
(0, _defineProperty2.default)(HctSolver, "SCALED_DISCOUNT_FROM_LINRGB", [[0.001200833568784504, 0.002389694492170889, 0.0002795742885861124], [0.0005891086651375999, 0.0029785502573438758, 0.0003270666104008398], [0.00010146692491640572, 0.0005364214359186694, 0.0032979401770712076]]);
(0, _defineProperty2.default)(HctSolver, "LINRGB_FROM_SCALED_DISCOUNT", [[1373.2198709594231, -1100.4251190754821, -7.278681089101213], [-271.815969077903, 559.6580465940733, -32.46047482791194], [1.9622899599665666, -57.173814538844006, 308.7233197812385]]);
(0, _defineProperty2.default)(HctSolver, "Y_FROM_LINRGB", [0.2126, 0.7152, 0.0722]);
(0, _defineProperty2.default)(HctSolver, "CRITICAL_PLANES", [0.015176349177441876, 0.045529047532325624, 0.07588174588720938, 0.10623444424209313, 0.13658714259697685, 0.16693984095186062, 0.19729253930674434, 0.2276452376616281, 0.2579979360165119, 0.28835063437139563, 0.3188300904430532, 0.350925934958123, 0.3848314933096426, 0.42057480301049466, 0.458183274052838, 0.4976837250274023, 0.5391024159806381, 0.5824650784040898, 0.6277969426914107, 0.6751227633498623, 0.7244668422128921, 0.775853049866786, 0.829304845476233, 0.8848452951698498, 0.942497089126609, 1.0022825574869039, 1.0642236851973577, 1.1283421258858297, 1.1946592148522128, 1.2631959812511864, 1.3339731595349034, 1.407011200216447, 1.4823302800086415, 1.5599503113873272, 1.6398909516233677, 1.7221716113234105, 1.8068114625156377, 1.8938294463134073, 1.9832442801866852, 2.075074464868551, 2.1693382909216234, 2.2660538449872063, 2.36523901573795, 2.4669114995532007, 2.5710888059345764, 2.6777882626779785, 2.7870270208169257, 2.898822059350997, 3.0131901897720907, 3.1301480604002863, 3.2497121605402226, 3.3718988244681087, 3.4967242352587946, 3.624204428461639, 3.754355295633311, 3.887192587735158, 4.022731918402185, 4.160988767090289, 4.301978482107941, 4.445716283538092, 4.592217266055746, 4.741496401646282, 4.893568542229298, 5.048448422192488, 5.20615066083972, 5.3666897647573375, 5.5300801301023865, 5.696336044816294, 5.865471690767354, 6.037501145825082, 6.212438385869475, 6.390297286737924, 6.571091626112461, 6.7548350853498045, 6.941541251256611, 7.131223617812143, 7.323895587840543, 7.5195704746346665, 7.7182615035334345, 7.919981813454504, 8.124744458384042, 8.332562408825165, 8.543448553206703, 8.757415699253682, 8.974476575321063, 9.194643831691977, 9.417930041841839, 9.644347703669503, 9.873909240696694, 10.106627003236781, 10.342513269534024, 10.58158024687427, 10.8238400726681, 11.069304815507364, 11.317986476196008, 11.569896988756009, 11.825048221409341, 12.083451977536606, 12.345119996613247, 12.610063955123938, 12.878295467455942, 13.149826086772048, 13.42466730586372, 13.702830557985108, 13.984327217668513, 14.269168601521828, 14.55736596900856, 14.848930523210871, 15.143873411576273, 15.44220572664832, 15.743938506781891, 16.04908273684337, 16.35764934889634, 16.66964922287304, 16.985093187232053, 17.30399201960269, 17.62635644741625, 17.95219714852476, 18.281524751807332, 18.614349837764564, 18.95068293910138, 19.290534541298456, 19.633915083172692, 19.98083495742689, 20.331304511189067, 20.685334046541502, 21.042933821039977, 21.404114048223256, 21.76888489811322, 22.137256497705877, 22.50923893145328, 22.884842241736916, 23.264076429332462, 23.6469514538663, 24.033477234264016, 24.42366364919083, 24.817520537484558, 25.21505769858089, 25.61628489293138, 26.021211842414342, 26.429848230738664, 26.842203703840827, 27.258287870275353, 27.678110301598522, 28.10168053274597, 28.529008062403893, 28.96010235337422, 29.39497283293396, 29.83362889318845, 30.276079891419332, 30.722335150426627, 31.172403958865512, 31.62629557157785, 32.08401920991837, 32.54558406207592, 33.010999283389665, 33.4802739966603, 33.953417292456834, 34.430438229418264, 34.911345834551085, 35.39614910352207, 35.88485700094671, 36.37747846067349, 36.87402238606382, 37.37449765026789, 37.87891309649659, 38.38727753828926, 38.89959975977785, 39.41588851594697, 39.93615253289054, 40.460400508064545, 40.98864111053629, 41.520882981230194, 42.05713473317016, 42.597404951718396, 43.141702194811224, 43.6900349931913, 44.24241185063697, 44.798841244188324, 45.35933162437017, 45.92389141541209, 46.49252901546552, 47.065252796817916, 47.64207110610409, 48.22299226451468, 48.808024568002054, 49.3971762874833, 49.9904556690408, 50.587870934119984, 51.189430279724725, 51.79514187861014, 52.40501387947288, 53.0190544071392, 53.637271562750364, 54.259673423945976, 54.88626804504493, 55.517063457223934, 56.15206766869424, 56.79128866487574, 57.43473440856916, 58.08241284012621, 58.734331877617365, 59.39049941699807, 60.05092333227251, 60.715611475655585, 61.38457167773311, 62.057811747619894, 62.7353394731159, 63.417162620860914, 64.10328893648692, 64.79372614476921, 65.48848194977529, 66.18756403501224, 66.89098006357258, 67.59873767827808, 68.31084450182222, 69.02730813691093, 69.74813616640164, 70.47333615344107, 71.20291564160104, 71.93688215501312, 72.67524319850172, 73.41800625771542, 74.16517879925733, 74.9167682708136, 75.67278210128072, 76.43322770089146, 77.1981124613393, 77.96744375590167, 78.74122893956174, 79.51947534912904, 80.30219030335869, 81.08938110306934, 81.88105503125999, 82.67721935322541, 83.4778813166706, 84.28304815182372, 85.09272707154808, 85.90692527145302, 86.72564993000343, 87.54890820862819, 88.3767072518277, 89.2090541872801, 90.04595612594655, 90.88742016217518, 91.73345337380438, 92.58406282226491, 93.43925555268066, 94.29903859396902, 95.16341895893969, 96.03240364439274, 96.9059996312159, 97.78421388448044, 98.6670533535366, 99.55452497210776]);
var ViewingConditions = exports.ViewingConditions = /*#__PURE__*/function () {
  /**
   * Parameters are intermediate values of the CAM16 conversion process. Their
   * names are shorthand for technical color science terminology, this class
   * would not benefit from documenting them individually. A brief overview
   * is available in the CAM16 specification, and a complete overview requires
   * a color science textbook, such as Fairchild's Color Appearance Models.
   */
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
  (0, _createClass2.default)(ViewingConditions, null, [{
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
      var whitePoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : utils.whitePointD65();
      var adaptingLuminance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200.0 / Math.PI * utils.yFromLstar(50.0) / 100.0;
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
      var n = utils.yFromLstar(backgroundLstar) / whitePoint[1];
      var z = 1.48 + Math.sqrt(n);
      var nbb = 0.725 / Math.pow(n, 0.2);
      var ncb = nbb;
      var rgbAFactors = [Math.pow(fl * rgbD[0] * rW / 100.0, 0.42), Math.pow(fl * rgbD[1] * gW / 100.0, 0.42), Math.pow(fl * rgbD[2] * bW / 100.0, 0.42)];
      var rgbA = [400.0 * rgbAFactors[0] / (rgbAFactors[0] + 27.13), 400.0 * rgbAFactors[1] / (rgbAFactors[1] + 27.13), 400.0 * rgbAFactors[2] / (rgbAFactors[2] + 27.13)];
      var aw = (2.0 * rgbA[0] + rgbA[1] + 0.05 * rgbA[2]) * nbb;
      return new ViewingConditions(n, aw, nbb, ncb, c, nc, rgbD, fl, Math.pow(fl, 0.25), z);
    }
  }]);
  return ViewingConditions;
}();
_class2 = ViewingConditions;
/**
 * sRGB-like viewing conditions.
 */
(0, _defineProperty2.default)(ViewingConditions, "DEFAULT", _class2.make());