"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesNoImageIcon = function MediaServicesNoImageIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M19.41 3.041l.72-.72a1.095 1.095 0 1 1 1.55 1.548L3.87 21.68a1.095 1.095 0 1 1-1.55-1.55l.72-.72a2.005 2.005 0 0 1-.04-.405V4.995C3 3.893 3.893 3 4.995 3h14.01c.139 0 .274.014.405.041zM21 7.531v11.474A1.995 1.995 0 0 1 19.005 21H7.53l3-3H18v-2.7l-2.271-2.498L21 7.53zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z\" fill=\"currentColor\"/></svg>"
  }, props));
};

MediaServicesNoImageIcon.displayName = 'MediaServicesNoImageIcon';
var _default = MediaServicesNoImageIcon;
exports.default = _default;