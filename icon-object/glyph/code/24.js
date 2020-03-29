"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Code24Icon = function Code24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#6554C0\" fill-rule=\"evenodd\" d=\"M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm5.583 7.002l-4.29 4.287a1 1 0 0 0 0 1.415l4.291 4.285a.999.999 0 0 0 1.414-.002 1.002 1.002 0 0 0-.001-1.414l-3.582-3.576 3.582-3.58a1.002 1.002 0 0 0-.707-1.708.993.993 0 0 0-.707.293zm5.41-.013a.999.999 0 0 0 .002 1.413l3.59 3.587-3.59 3.588a1.001 1.001 0 0 0 1.414 1.415l4.298-4.296a1 1 0 0 0 0-1.415l-4.3-4.293a.994.994 0 0 0-1.414.001z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Code24Icon.displayName = 'Code24Icon';
var _default = Code24Icon;
exports.default = _default;