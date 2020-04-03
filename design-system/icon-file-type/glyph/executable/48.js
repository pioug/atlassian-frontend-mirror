"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Executable48Icon = function Executable48Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"48\" height=\"64\" viewBox=\"0 0 48 64\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><path fill=\"#FFF\" stroke=\"#091E42\" stroke-opacity=\".08\" d=\"M4 .5h28.007a3.5 3.5 0 0 1 2.52 1.072l11.994 12.45a3.5 3.5 0 0 1 .979 2.429V60a3.5 3.5 0 0 1-3.5 3.5H4A3.5 3.5 0 0 1 .5 60V4A3.5 3.5 0 0 1 4 .5z\"/><path fill=\"#5E6C84\" d=\"M15.833 33.167l1.058-8.458a1 1 0 0 1 .992-.876h12.234a1 1 0 0 1 .992.876l1.058 8.458v6a1 1 0 0 1-1 1H16.833a1 1 0 0 1-1-1v-6zm3.334 2.333a1 1 0 0 0-1 1v.333a1 1 0 0 0 1 1h9.666a1 1 0 0 0 1-1V36.5a1 1 0 0 0-1-1h-9.666z\"/></g></svg>"
  }, props, {
    size: "xlarge"
  }));
};

Executable48Icon.displayName = 'Executable48Icon';
var _default = Executable48Icon;
exports.default = _default;