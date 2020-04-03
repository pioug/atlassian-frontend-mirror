"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var VidShareScreenIcon = function VidShareScreenIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M13 4H4.995C3.893 4 3 4.9 3 6.009v7.982C3 15.098 3.893 16 4.995 16h14.01C20.107 16 21 15.1 21 13.991V7.5 11h-2v3H5V6h8V4z\" fill-rule=\"nonzero\"/><path d=\"M10 17h4v3h-4z\"/><path d=\"M9 20a1 1 0 0 1 .99-1h4.02c.546 0 .99.444.99 1v1H9v-1z\"/><path d=\"M19 5v3a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1h-4a1 1 0 0 0 0 2h3z\" fill-rule=\"nonzero\"/><path d=\"M19 3.586l-6.707 6.707a1 1 0 0 0 1.414 1.414L20.414 5H19V3.586z\" fill-rule=\"nonzero\"/></g></svg>"
  }, props));
};

VidShareScreenIcon.displayName = 'VidShareScreenIcon';
var _default = VidShareScreenIcon;
exports.default = _default;