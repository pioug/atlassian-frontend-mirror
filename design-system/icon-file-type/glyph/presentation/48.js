"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Presentation48Icon = function Presentation48Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"48\" height=\"64\" viewBox=\"0 0 48 64\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><path fill=\"#FFF\" stroke=\"#091E42\" stroke-opacity=\".08\" d=\"M4 .5h28.007a3.5 3.5 0 0 1 2.52 1.072l11.994 12.45a3.5 3.5 0 0 1 .979 2.429V60a3.5 3.5 0 0 1-3.5 3.5H4A3.5 3.5 0 0 1 .5 60V4A3.5 3.5 0 0 1 4 .5z\"/><path fill=\"#6554C0\" d=\"M17 34.333c.644 0 1.167.523 1.167 1.167V39a1.167 1.167 0 0 1-2.334 0v-3.5c0-.644.523-1.167 1.167-1.167zm9.333-7c.645 0 1.167.523 1.167 1.167V39a1.167 1.167 0 0 1-2.333 0V28.5c0-.644.522-1.167 1.166-1.167zM21.667 32c.644 0 1.166.522 1.166 1.167V39a1.167 1.167 0 1 1-2.333 0v-5.833c0-.645.522-1.167 1.167-1.167zM31 23.833c.644 0 1.167.523 1.167 1.167v14a1.167 1.167 0 0 1-2.334 0V25c0-.644.523-1.167 1.167-1.167z\"/></g></svg>"
  }, props, {
    size: "xlarge"
  }));
};

Presentation48Icon.displayName = 'Presentation48Icon';
var _default = Presentation48Icon;
exports.default = _default;