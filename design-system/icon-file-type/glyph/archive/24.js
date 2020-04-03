"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Archive24Icon = function Archive24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#5E6C84\" fill-rule=\"evenodd\" d=\"M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm6 3v3h3V3H9zm3 3v3h3V6h-3zM9 9v3h3V9H9zm3 3v3h3v-3h-3zm-3 3v3h3v-3H9zm3 3v3h3v-3h-3z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Archive24Icon.displayName = 'Archive24Icon';
var _default = Archive24Icon;
exports.default = _default;