"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PdfIcon = function PdfIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><rect fill=\"currentColor\" x=\"5\" y=\"4\" width=\"14\" height=\"16\" rx=\"2\"/><rect fill=\"inherit\" x=\"8\" y=\"8\" width=\"8\" height=\"2\" rx=\"1\"/><path d=\"M15.512 16H13.49a.492.492 0 0 1-.489-.497v-4.006c0-.275.218-.497.489-.497h2.023c.27 0 .488.222.488.497v4.006a.492.492 0 0 1-.488.497\" fill=\"inherit\"/><rect fill=\"inherit\" x=\"8\" y=\"11\" width=\"4\" height=\"2\" rx=\"1\"/><rect fill=\"inherit\" x=\"8\" y=\"14\" width=\"4\" height=\"2\" rx=\"1\"/></g></svg>"
  }, props));
};

PdfIcon.displayName = 'PdfIcon';
var _default = PdfIcon;
exports.default = _default;