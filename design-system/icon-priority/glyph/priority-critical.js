"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PriorityCriticalIcon = function PriorityCriticalIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M4.671 7.165l6.643-3.946a1.372 1.372 0 0 1 1.403.002l6.614 3.944c.415.247.669.695.669 1.178v11.253a1.372 1.372 0 0 1-2.074 1.179l-5.91-3.52-5.944 3.526A1.372 1.372 0 0 1 4 19.6V8.345c0-.484.255-.933.671-1.18z\" fill=\"#FF5630\"/></svg>"
  }, props));
};

PriorityCriticalIcon.displayName = 'PriorityCriticalIcon';
var _default = PriorityCriticalIcon;
exports.default = _default;