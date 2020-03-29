"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var RecentIcon = function RecentIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M11 8.002v4.002c0 .28.116.53.301.712l2.47 2.47a1.003 1.003 0 0 0 1.414 0 1.003 1.003 0 0 0 0-1.415L13 11.586V8.004A1.009 1.009 0 0 0 13 8V6a1 1 0 0 0-2 0v2.002zM12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

RecentIcon.displayName = 'RecentIcon';
var _default = RecentIcon;
exports.default = _default;