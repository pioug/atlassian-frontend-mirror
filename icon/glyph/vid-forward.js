"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var VidForwardIcon = function VidForwardIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M10.97 13.87l-6.273 3.858C3.76 18.305 3 17.883 3 16.773V7.226c0-1.104.757-1.533 1.697-.956l6.273 3.858V7.226c0-1.104.757-1.533 1.697-.956l7.62 4.686c.936.576.939 1.509 0 2.087l-7.62 4.685c-.937.577-1.697.155-1.697-.955V13.87z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

VidForwardIcon.displayName = 'VidForwardIcon';
var _default = VidForwardIcon;
exports.default = _default;