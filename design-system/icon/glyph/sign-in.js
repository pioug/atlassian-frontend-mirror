"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SignInIcon = function SignInIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M15.503 3H12v2h7v14h-7v2h7.006c1.1 0 1.994-.893 1.994-1.995V4.995A1.993 1.993 0 0 0 19.006 3h-3.503z\"/><path d=\"M3.977 11A.99.99 0 0 0 3 12.001c0 .551.437.999.977.999h11.047a.988.988 0 0 0 .976-.999.99.99 0 0 0-.976-1.001H3.977z\"/><path d=\"M12.303 8.305a1.053 1.053 0 0 0 0 1.478L14.5 12l-2.197 2.217a1.05 1.05 0 0 0 0 1.476c.404.409 1.06.409 1.465 0l2.93-2.955a1.055 1.055 0 0 0 0-1.477l-2.93-2.956a1.034 1.034 0 0 0-1.465 0z\"/></g></svg>"
  }, props));
};

SignInIcon.displayName = 'SignInIcon';
var _default = SignInIcon;
exports.default = _default;