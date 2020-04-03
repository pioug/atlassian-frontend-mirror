"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesUnknownIcon = function MediaServicesUnknownIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><rect fill=\"currentColor\" x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/><path d=\"M12 11h3.502a.5.5 0 0 1 .498.491v4.518A.993.993 0 0 1 15 17H9.01C8.451 17 8 16.544 8 16.005v-8.01C8 7.445 8.443 7 9.01 7h2.5a.5.5 0 0 1 .49.51V11zm1-4l3 3h-3V7z\" fill=\"inherit\"/></g></svg>"
  }, props));
};

MediaServicesUnknownIcon.displayName = 'MediaServicesUnknownIcon';
var _default = MediaServicesUnknownIcon;
exports.default = _default;