"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Contrast = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var utils = _interopRequireWildcard(require("./color-utils"));
var math = _interopRequireWildcard(require("./math-utils"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Below lines are copied from @material/material-color-utilities.
 * Do not modify it.
 */
/**
 * @license
 * Copyright 2022 Google LLC
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
// material_color_utilities is designed to have a consistent API across
// platforms and modular components that can be moved around easily. Using a
// class as a namespace facilitates this.
//
// tslint:disable:class-as-namespace
/**
 * Utility methods for calculating contrast given two colors, or calculating a
 * color given one color and a contrast ratio.
 *
 * Contrast ratio is calculated using XYZ's Y. When linearized to match human
 * perception, Y becomes HCT's tone and L*a*b*'s' L*. Informally, this is the
 * lightness of a color.
 *
 * Methods refer to tone, T in the the HCT color space.
 * Tone is equivalent to L* in the L*a*b* color space, or L in the LCH color
 * space.
 */
var Contrast = exports.Contrast = /*#__PURE__*/function () {
  function Contrast() {
    (0, _classCallCheck2.default)(this, Contrast);
  }
  (0, _createClass2.default)(Contrast, null, [{
    key: "ratioOfTones",
    value:
    /**
     * Returns a contrast ratio, which ranges from 1 to 21.
     *
     * @param toneA Tone between 0 and 100. Values outside will be clamped.
     * @param toneB Tone between 0 and 100. Values outside will be clamped.
     */
    function ratioOfTones(toneA, toneB) {
      toneA = math.clampDouble(0.0, 100.0, toneA);
      toneB = math.clampDouble(0.0, 100.0, toneB);
      return Contrast.ratioOfYs(utils.yFromLstar(toneA), utils.yFromLstar(toneB));
    }
  }, {
    key: "ratioOfYs",
    value: function ratioOfYs(y1, y2) {
      var lighter = y1 > y2 ? y1 : y2;
      var darker = lighter === y2 ? y1 : y2;
      return (lighter + 5.0) / (darker + 5.0);
    }

    /**
     * Returns a tone >= tone parameter that ensures ratio parameter.
     * Return value is between 0 and 100.
     * Returns -1 if ratio cannot be achieved with tone parameter.
     *
     * @param tone Tone return value must contrast with.
     * Range is 0 to 100. Invalid values will result in -1 being returned.
     * @param ratio Contrast ratio of return value and tone.
     * Range is 1 to 21, invalid values have undefined behavior.
     */
  }, {
    key: "lighter",
    value: function lighter(tone, ratio) {
      if (tone < 0.0 || tone > 100.0) {
        return -1.0;
      }
      var darkY = utils.yFromLstar(tone);
      var lightY = ratio * (darkY + 5.0) - 5.0;
      var realContrast = Contrast.ratioOfYs(lightY, darkY);
      var delta = Math.abs(realContrast - ratio);
      if (realContrast < ratio && delta > 0.04) {
        return -1;
      }

      // Ensure gamut mapping, which requires a 'range' on tone, will still result
      // the correct ratio by darkening slightly.
      var returnValue = utils.lstarFromY(lightY) + 0.4;
      if (returnValue < 0 || returnValue > 100) {
        return -1;
      }
      return returnValue;
    }

    /**
     * Returns a tone <= tone parameter that ensures ratio parameter.
     * Return value is between 0 and 100.
     * Returns -1 if ratio cannot be achieved with tone parameter.
     *
     * @param tone Tone return value must contrast with.
     * Range is 0 to 100. Invalid values will result in -1 being returned.
     * @param ratio Contrast ratio of return value and tone.
     * Range is 1 to 21, invalid values have undefined behavior.
     */
  }, {
    key: "darker",
    value: function darker(tone, ratio) {
      if (tone < 0.0 || tone > 100.0) {
        return -1.0;
      }
      var lightY = utils.yFromLstar(tone);
      var darkY = (lightY + 5.0) / ratio - 5.0;
      var realContrast = Contrast.ratioOfYs(lightY, darkY);
      var delta = Math.abs(realContrast - ratio);
      if (realContrast < ratio && delta > 0.04) {
        return -1;
      }

      // Ensure gamut mapping, which requires a 'range' on tone, will still result
      // the correct ratio by darkening slightly.
      var returnValue = utils.lstarFromY(darkY) - 0.4;
      if (returnValue < 0 || returnValue > 100) {
        return -1;
      }
      return returnValue;
    }

    /**
     * Returns a tone >= tone parameter that ensures ratio parameter.
     * Return value is between 0 and 100.
     * Returns 100 if ratio cannot be achieved with tone parameter.
     *
     * This method is unsafe because the returned value is guaranteed to be in
     * bounds for tone, i.e. between 0 and 100. However, that value may not reach
     * the ratio with tone. For example, there is no color lighter than T100.
     *
     * @param tone Tone return value must contrast with.
     * Range is 0 to 100. Invalid values will result in 100 being returned.
     * @param ratio Desired contrast ratio of return value and tone parameter.
     * Range is 1 to 21, invalid values have undefined behavior.
     */
  }, {
    key: "lighterUnsafe",
    value: function lighterUnsafe(tone, ratio) {
      var lighterSafe = Contrast.lighter(tone, ratio);
      return lighterSafe < 0.0 ? 100.0 : lighterSafe;
    }

    /**
     * Returns a tone >= tone parameter that ensures ratio parameter.
     * Return value is between 0 and 100.
     * Returns 100 if ratio cannot be achieved with tone parameter.
     *
     * This method is unsafe because the returned value is guaranteed to be in
     * bounds for tone, i.e. between 0 and 100. However, that value may not reach
     * the [ratio with [tone]. For example, there is no color darker than T0.
     *
     * @param tone Tone return value must contrast with.
     * Range is 0 to 100. Invalid values will result in 0 being returned.
     * @param ratio Desired contrast ratio of return value and tone parameter.
     * Range is 1 to 21, invalid values have undefined behavior.
     */
  }, {
    key: "darkerUnsafe",
    value: function darkerUnsafe(tone, ratio) {
      var darkerSafe = Contrast.darker(tone, ratio);
      return darkerSafe < 0.0 ? 0.0 : darkerSafe;
    }
  }]);
  return Contrast;
}();