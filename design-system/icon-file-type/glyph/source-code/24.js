"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SourceCode24Icon = function SourceCode24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#00B8D9\" fill-rule=\"evenodd\" d=\"M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm5.017 12.265l-2.58-2.501L8.236 7.05a.999.999 0 1 0-1.392-1.436l-3.54 3.432a1 1 0 0 0 0 1.436l3.32 3.219a1 1 0 1 0 1.393-1.436zm6.638-8.21a1 1 0 0 0-1.271.62l-4.83 14.046a1 1 0 0 0 1.892.65l4.829-14.045a1 1 0 0 0-.62-1.271zm6.081 9.776l-3.32-3.219a.999.999 0 1 0-1.393 1.436l2.58 2.501-2.799 2.714a.999.999 0 1 0 1.392 1.436l3.54-3.432a1 1 0 0 0 0-1.436z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

SourceCode24Icon.displayName = 'SourceCode24Icon';
var _default = SourceCode24Icon;
exports.default = _default;