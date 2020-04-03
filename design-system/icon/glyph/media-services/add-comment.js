"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesAddCommentIcon = function MediaServicesAddCommentIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M14 4.187A10.704 10.704 0 0 0 12 4c-4.963 0-9 3.37-9 7.513s4.037 7.514 9 7.514c1.42 0 2.76-.285 3.957-.776 1.003 1.022 2.287 1.572 3.24 1.719l.002-.003a.524.524 0 0 0 .164.033.515.515 0 0 0 .474-.716v-.002s-1.563-2.26-.766-3.116l-.037.02C20.261 14.902 21 13.279 21 11.513a6.34 6.34 0 0 0-.02-.513h-2.008c.02.169.03.34.03.513 0 3.039-3.141 5.51-7.002 5.51-3.861 0-7.002-2.471-7.002-5.51 0-3.038 3.141-5.51 7.002-5.51.695 0 1.366.08 2 .229V4.187z\"/><rect x=\"17\" y=\"4\" width=\"2\" height=\"6\" rx=\"1\"/><rect x=\"15\" y=\"6\" width=\"6\" height=\"2\" rx=\"1\"/></g></svg>"
  }, props));
};

MediaServicesAddCommentIcon.displayName = 'MediaServicesAddCommentIcon';
var _default = MediaServicesAddCommentIcon;
exports.default = _default;