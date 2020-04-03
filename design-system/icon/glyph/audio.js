"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var AudioIcon = function AudioIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M19 6.673V15.2a2.8 2.8 0 0 1-2.8 2.8h-.4a2.8 2.8 0 0 1-2.8-2.8v-.4a2.8 2.8 0 0 1 2.8-2.8h.4c.278 0 .547.04.8.116V8.242l-6 .621V16.2A2.8 2.8 0 0 1 8.2 19h-.4A2.8 2.8 0 0 1 5 16.2v-.4A2.8 2.8 0 0 1 7.8 13h.4c.278 0 .547.04.8.116V6.654c0-.38.31-.721.72-.764l8.56-.886c.398-.041.72.235.72.615v1.054z\" fill=\"currentColor\"/></svg>"
  }, props));
};

AudioIcon.displayName = 'AudioIcon';
var _default = AudioIcon;
exports.default = _default;