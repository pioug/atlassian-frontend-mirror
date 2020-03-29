"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var VidAudioMutedIcon = function VidAudioMutedIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M13.293 14.707A2.998 2.998 0 0 1 9 12.003v-1.589l-1-1v2.592A4.004 4.004 0 0 0 12 16a3.98 3.98 0 0 0 2.031-.554l-.738-.739zm2.183 2.183A5.974 5.974 0 0 1 13 17.917v2.074a1 1 0 1 1-2 0v-2.074c-2.838-.478-5-2.951-5-5.91V9a1 1 0 0 1 .65-.937L3.704 5.12a.996.996 0 0 1 .002-1.413.996.996 0 0 1 1.413-.002L20.123 18.71a.996.996 0 0 1-.002 1.412.996.996 0 0 1-1.412.002l-3.233-3.233zM9.186 4.958A3.004 3.004 0 0 1 12 3c1.657 0 3 1.342 3 2.997v4.775L9.186 4.958zm8.608 8.608L16 11.772V9a1 1 0 0 1 2 0v3.006c0 .54-.072 1.063-.206 1.56z\" fill=\"currentColor\"/></svg>"
  }, props));
};

VidAudioMutedIcon.displayName = 'VidAudioMutedIcon';
var _default = VidAudioMutedIcon;
exports.default = _default;