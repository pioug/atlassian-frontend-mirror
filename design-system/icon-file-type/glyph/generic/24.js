"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Generic24Icon = function Generic24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#5E6C84\" fill-rule=\"evenodd\" d=\"M12 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6.995h-2V18H8V6h4v2a2 2 0 0 0 2 2h3.5a.5.5 0 0 0 .5-.5V8.213a.5.5 0 0 0-.145-.352L14.61 4.59A2 2 0 0 0 13.19 4H12zM3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Generic24Icon.displayName = 'Generic24Icon';
var _default = Generic24Icon;
exports.default = _default;