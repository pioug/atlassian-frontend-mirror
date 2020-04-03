"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Issue24Icon = function Issue24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#2684FF\" fill-rule=\"evenodd\" d=\"M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm0 8.009v7.982C3 17.098 3.893 18 4.995 18h14.01C20.107 18 21 17.1 21 15.991V8.01A2.004 2.004 0 0 0 19.005 6H4.995C3.893 6 3 6.9 3 8.009zm11.293 1.284a1 1 0 0 1 1.414 1.414l-3.5 3.5a1 1 0 0 1-1.415-.001l-1.97-1.978a1 1 0 1 1 1.416-1.411l1.263 1.267 2.792-2.791zM5 15.99c0 .007 14.005.009 14.005.009C18.999 16 19 8.009 19 8.009 19 8.002 4.995 8 4.995 8 5.001 8 5 15.991 5 15.991z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Issue24Icon.displayName = 'Issue24Icon';
var _default = Issue24Icon;
exports.default = _default;