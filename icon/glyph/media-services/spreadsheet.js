"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesSpreadsheetIcon = function MediaServicesSpreadsheetIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><rect fill=\"currentColor\" x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/><rect fill=\"inherit\" x=\"7\" y=\"8\" width=\"4\" height=\"2\" rx=\"1\"/><rect fill=\"inherit\" x=\"7\" y=\"11\" width=\"4\" height=\"2\" rx=\"1\"/><rect fill=\"inherit\" x=\"13\" y=\"11\" width=\"4\" height=\"2\" rx=\"1\"/><rect fill=\"inherit\" x=\"7\" y=\"14\" width=\"4\" height=\"2\" rx=\"1\"/><rect fill=\"inherit\" x=\"13\" y=\"14\" width=\"4\" height=\"2\" rx=\"1\"/><rect fill=\"inherit\" x=\"13\" y=\"8\" width=\"4\" height=\"2\" rx=\"1\"/></g></svg>"
  }, props));
};

MediaServicesSpreadsheetIcon.displayName = 'MediaServicesSpreadsheetIcon';
var _default = MediaServicesSpreadsheetIcon;
exports.default = _default;