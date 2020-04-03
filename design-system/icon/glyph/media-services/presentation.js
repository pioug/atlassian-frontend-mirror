"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesPresentationIcon = function MediaServicesPresentationIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><rect fill=\"currentColor\" x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/><rect fill=\"inherit\" x=\"8\" y=\"12\" width=\"2\" height=\"3\" rx=\"1\"/><rect fill=\"inherit\" x=\"11\" y=\"10\" width=\"2\" height=\"5\" rx=\"1\"/><rect fill=\"inherit\" x=\"14\" y=\"8\" width=\"2\" height=\"7\" rx=\"1\"/></g></svg>"
  }, props));
};

MediaServicesPresentationIcon.displayName = 'MediaServicesPresentationIcon';
var _default = MediaServicesPresentationIcon;
exports.default = _default;