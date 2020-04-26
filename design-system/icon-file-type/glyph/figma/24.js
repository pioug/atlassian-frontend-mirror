"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Figma24Icon = function Figma24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M3.248 0A3.248 3.248 0 0 0 0 3.248v17.504A3.248 3.248 0 0 0 3.248 24h17.504A3.248 3.248 0 0 0 24 20.752V3.248A3.248 3.248 0 0 0 20.752 0H3.248zm8.755 17.012a2.506 2.506 0 0 1-2.505 2.507 2.506 2.506 0 0 1 0-5.013 2.506 2.506 0 0 1 0-5.012 2.506 2.506 0 0 1 0-5.013h5.009a2.506 2.506 0 0 1 0 5.013h-2.505v2.5a2.506 2.506 0 0 1 2.505-2.5 2.506 2.506 0 0 1 0 5.012 2.506 2.506 0 0 1-2.505-2.5v5.006z\" fill=\"#5243AA\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Figma24Icon.displayName = 'Figma24Icon';
var _default = Figma24Icon;
exports.default = _default;