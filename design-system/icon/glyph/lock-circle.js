"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var LockCircleIcon = function LockCircleIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><circle fill=\"currentColor\" cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12.02 8h-.04A1.98 1.98 0 0 0 10 9.98V11h1V9.99a.99.99 0 0 1 .99-.99h.02a.99.99 0 0 1 .99.99V11h1V9.98A1.98 1.98 0 0 0 12.02 8M10 11h1v1h-1zm3 0h1v1h-1zm0 1h-3a1 1 0 0 0-1 1v2.001a1 1 0 0 0 .991.999h4.018a.992.992 0 0 0 .991-.999V13a1 1 0 0 0-1-1h-1z\" fill=\"inherit\"/></g></svg>"
  }, props));
};

LockCircleIcon.displayName = 'LockCircleIcon';
var _default = LockCircleIcon;
exports.default = _default;