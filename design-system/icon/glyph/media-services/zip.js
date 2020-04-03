"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesZipIcon = function MediaServicesZipIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><rect fill=\"currentColor\" x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/><path d=\"M9 6.999C9 6.447 9.443 6 9.999 6H12v3H9.999A.996.996 0 0 1 9 8.001V6.999zM12 9h2.001c.552 0 .999.443.999.999v1.002a.996.996 0 0 1-.999.999H12V9zm-3 3.999c0-.552.443-.999.999-.999H12v3H9.999A.996.996 0 0 1 9 14.001v-1.002zM12 15h2.001c.552 0 .999.443.999.999v1.002a.996.996 0 0 1-.999.999H12v-3z\" fill=\"inherit\"/></g></svg>"
  }, props));
};

MediaServicesZipIcon.displayName = 'MediaServicesZipIcon';
var _default = MediaServicesZipIcon;
exports.default = _default;