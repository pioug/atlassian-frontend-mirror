"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ExportIcon = function ExportIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M13 6.491V16a1 1 0 0 1-2 0V6.491L9.784 7.697a1.051 1.051 0 0 1-1.478 0 1.029 1.029 0 0 1 0-1.465l2.955-2.929a1.051 1.051 0 0 1 1.478 0l2.955 2.93c.408.404.408 1.06 0 1.464a1.051 1.051 0 0 1-1.478 0L13 6.49zM9 9v2H7c-.002 0 0 7.991 0 7.991 0 .004 9.994.009 9.994.009.003 0 .006-7.991.006-7.991 0-.006-2-.009-2-.009V9h2c1.105 0 2 .902 2 2.009v7.982c0 1.11-.897 2.009-2.006 2.009H7.006A2.009 2.009 0 0 1 5 18.991V11.01A2 2 0 0 1 7 9h2z\" fill=\"currentColor\"/></svg>"
  }, props));
};

ExportIcon.displayName = 'ExportIcon';
var _default = ExportIcon;
exports.default = _default;