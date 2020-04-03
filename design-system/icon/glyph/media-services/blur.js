"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesBlurIcon = function MediaServicesBlurIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\"><path d=\"M4.889 4H12v8H4V4.889C4 4.398 4.398 4 4.889 4z\"/><path d=\"M4 12h8v8H4.889A.889.889 0 0 1 4 19.111V12z\" opacity=\".4\"/><path d=\"M12 4h7.111c.491 0 .889.398.889.889V12h-8V4z\" opacity=\".55\"/><path d=\"M12 12h8v7.111a.889.889 0 0 1-.889.889H12v-8z\" opacity=\".75\"/></g></svg>"
  }, props));
};

MediaServicesBlurIcon.displayName = 'MediaServicesBlurIcon';
var _default = MediaServicesBlurIcon;
exports.default = _default;