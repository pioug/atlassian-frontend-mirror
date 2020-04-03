"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var HipchatLobbyIcon = function HipchatLobbyIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M5 14a7.002 7.002 0 0 1 13.858 0H5z\"/><rect x=\"4\" y=\"15\" width=\"16\" height=\"2\" rx=\"1\"/><path d=\"M11 7h2v3h-2z\"/><rect x=\"10\" y=\"6\" width=\"4\" height=\"1\" rx=\".5\"/></g></svg>"
  }, props));
};

HipchatLobbyIcon.displayName = 'HipchatLobbyIcon';
var _default = HipchatLobbyIcon;
exports.default = _default;