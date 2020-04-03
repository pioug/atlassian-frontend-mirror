"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var WorldSmallIcon = function WorldSmallIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm-.5-2.035A3.994 3.994 0 0 1 8 12c0-.31.04-.605.105-.895L10.5 13.5v.5c0 .55.45 1 1 1v.965zm3.45-1.27A.992.992 0 0 0 14 14h-.5v-1.5c0-.275-.225-.5-.5-.5h-3v-1h1c.275 0 .5-.225.5-.5v-1h1c.55 0 1-.45 1-1v-.205A4.002 4.002 0 0 1 16 12c0 1.04-.4 1.985-1.05 2.695z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

WorldSmallIcon.displayName = 'WorldSmallIcon';
var _default = WorldSmallIcon;
exports.default = _default;