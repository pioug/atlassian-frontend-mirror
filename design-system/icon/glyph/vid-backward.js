"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var VidBackwardIcon = function VidBackwardIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M13.02 13.857l6.273 3.858c.937.577 1.697.155 1.697-.955V7.212c0-1.103-.757-1.533-1.697-.955l-6.273 3.858V7.212c0-1.103-.757-1.533-1.697-.955l-7.62 4.686c-.936.576-.94 1.51 0 2.087l7.62 4.685c.937.577 1.697.155 1.697-.955v-2.903z\"/></svg>"
  }, props));
};

VidBackwardIcon.displayName = 'VidBackwardIcon';
var _default = VidBackwardIcon;
exports.default = _default;