"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ScreenIcon = function ScreenIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M3 6.009C3 4.899 3.893 4 4.995 4h14.01C20.107 4 21 4.902 21 6.009v7.982c0 1.11-.893 2.009-1.995 2.009H4.995A2.004 2.004 0 0 1 3 13.991V6.01zM5 14h14V6H5v8z\" fill-rule=\"nonzero\"/><path d=\"M10 17h4v3h-4zm-1 3.5a.5.5 0 0 1 .491-.5h5.018a.5.5 0 0 1 .491.5v.5H9v-.5z\"/></g></svg>"
  }, props));
};

ScreenIcon.displayName = 'ScreenIcon';
var _default = ScreenIcon;
exports.default = _default;