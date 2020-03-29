"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Story24Icon = function Story24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#36B37E\" fill-rule=\"evenodd\" d=\"M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm12.647 19.515l1.29-1.528L12 13.82l-4.939 4.167c-.022.018-.061.005-.061.166V6.688C7 6.348 7.412 6 8 6h8c.587 0 1 .349 1 .688v11.465c0-.162-.04-.147-.063-.166l-1.29 1.528C16.885 20.56 19 19.821 19 18.153V6.688C19 5.162 17.623 4 16 4H8C6.376 4 5 5.161 5 6.688v11.465c0 1.668 2.113 2.407 3.351 1.362L12 16.437l3.647 3.078z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Story24Icon.displayName = 'Story24Icon';
var _default = Story24Icon;
exports.default = _default;