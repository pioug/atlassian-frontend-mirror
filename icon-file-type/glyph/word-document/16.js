"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var WordDocument16Icon = function WordDocument16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#004E8C\" fill-rule=\"evenodd\" d=\"M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm1.235 4.258A.273.273 0 0 0 3 4.53v6.969c0 .136.1.252.236.27l6.953.962a.273.273 0 0 0 .311-.271V3.542a.273.273 0 0 0-.312-.27l-6.953.986zm7.89.617v6.25h1.563c.172 0 .312-.14.312-.313V5.189a.312.312 0 0 0-.313-.313h-1.562zM6.803 7.602L6.012 10.4h-.835l-1.12-4.228h.92l.66 2.98h.047l.77-2.98h.747l.786 2.98h.046l.654-2.98H9.6L8.479 10.4h-.83l-.8-2.798h-.046z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

WordDocument16Icon.displayName = 'WordDocument16Icon';
var _default = WordDocument16Icon;
exports.default = _default;