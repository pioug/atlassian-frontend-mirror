"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var LabelIcon = function LabelIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M11.433 5.428l-4.207.6A2 2 0 0 0 5.53 7.727l-.6 4.207a1 1 0 0 0 .281.849l6.895 6.894a.999.999 0 0 0 1.414 0l5.657-5.657a1 1 0 0 0 0-1.414L12.282 5.71a.998.998 0 0 0-.849-.283m-.647 5.858A1.666 1.666 0 1 1 8.43 8.929a1.666 1.666 0 0 1 2.357 2.357\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

LabelIcon.displayName = 'LabelIcon';
var _default = LabelIcon;
exports.default = _default;