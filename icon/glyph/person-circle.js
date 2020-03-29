"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PersonCircleIcon = function PersonCircleIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M14.5 13.009h-5c-1.38 0-2.5 1.12-2.5 2.503v3.978a8.951 8.951 0 0 0 5 1.519 8.95 8.95 0 0 0 5-1.519v-3.978a2.502 2.502 0 0 0-2.5-2.503\"/><circle cx=\"12\" cy=\"9\" r=\"3\"/><path d=\"M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 2C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z\" fill-rule=\"nonzero\"/></g></svg>"
  }, props));
};

PersonCircleIcon.displayName = 'PersonCircleIcon';
var _default = PersonCircleIcon;
exports.default = _default;