"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PowerpointPresentation16Icon = function PowerpointPresentation16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#CA5010\" fill-rule=\"evenodd\" d=\"M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm1.235 4.258A.273.273 0 0 0 3 4.53v6.969c0 .136.1.252.236.27l6.953.962a.273.273 0 0 0 .311-.271V3.542a.273.273 0 0 0-.312-.27l-6.953.986zm7.89.617v6.25h1.563c.172 0 .312-.14.312-.313V5.189a.312.312 0 0 0-.313-.313h-1.562zM5.313 6.072h1.763c.87 0 1.465.583 1.465 1.462 0 .87-.618 1.454-1.509 1.454h-.835V10.3h-.884V6.072zm.884.727v1.47h.642c.507 0 .803-.257.803-.732 0-.48-.29-.738-.8-.738h-.645z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

PowerpointPresentation16Icon.displayName = 'PowerpointPresentation16Icon';
var _default = PowerpointPresentation16Icon;
exports.default = _default;