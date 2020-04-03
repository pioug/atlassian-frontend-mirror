"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var UnlockIcon = function UnlockIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\"><path d=\"M5 11.009C5 9.899 5.897 9 7.006 9h9.988A2.01 2.01 0 0 1 19 11.009v7.982c0 1.11-.897 2.009-2.006 2.009H7.006A2.009 2.009 0 0 1 5 18.991V11.01zM7 11v8h10v-8H7z\"/><circle cx=\"12\" cy=\"15\" r=\"2\"/><path d=\"M8 6.251v-.249A4.004 4.004 0 0 1 12 2a4 4 0 0 1 4 4.002V6.5h-2v-.498A2.001 2.001 0 0 0 12 4c-1.102 0-2 .898-2 2.002V11H8V6.251zm6 .249h2a1 1 0 0 1-2 0z\"/></g></svg>"
  }, props));
};

UnlockIcon.displayName = 'UnlockIcon';
var _default = UnlockIcon;
exports.default = _default;