"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getIncreasedContrastTheme;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _themeConfig = _interopRequireDefault(require("../theme-config"));
/**
 * Finds any matching increased contrast theme available for a selected theme.
 */
function getIncreasedContrastTheme(themeId) {
  var _Object$entries$find;
  return (_Object$entries$find = Object.entries(_themeConfig.default).find(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
      increasesContrastFor = _ref2[1].increasesContrastFor;
    return increasesContrastFor === themeId;
  })) === null || _Object$entries$find === void 0 ? void 0 : _Object$entries$find[1].id;
}