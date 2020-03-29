"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SignOutIcon = function SignOutIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M4.977 11A.989.989 0 0 0 4 12c0 .551.437 1 .977 1h11.046A.99.99 0 0 0 17 12a.99.99 0 0 0-.977-1H4.977z\"/><path d=\"M6.231 8.306l-2.93 2.956a1.054 1.054 0 0 0 0 1.476l2.93 2.957a1.034 1.034 0 0 0 1.466 0 1.05 1.05 0 0 0 0-1.478L5.5 12.001l2.197-2.218a1.05 1.05 0 0 0 0-1.477 1.033 1.033 0 0 0-1.466 0zM15.503 3H12v2h7v14h-7v2h7.006c1.1 0 1.994-.893 1.994-1.995V4.995A1.993 1.993 0 0 0 19.006 3h-3.503z\"/></g></svg>"
  }, props));
};

SignOutIcon.displayName = 'SignOutIcon';
var _default = SignOutIcon;
exports.default = _default;