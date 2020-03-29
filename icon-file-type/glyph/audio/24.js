"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Audio24Icon = function Audio24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#FF5630\" fill-rule=\"evenodd\" d=\"M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm16 6.673V5.619c0-.38-.322-.656-.72-.615l-8.56.886c-.41.043-.72.383-.72.764v6.462A2.8 2.8 0 0 0 8.2 13h-.4A2.8 2.8 0 0 0 5 15.8v.4A2.8 2.8 0 0 0 7.8 19h.4a2.8 2.8 0 0 0 2.8-2.8V8.863l6-.62v3.873a2.8 2.8 0 0 0-.8-.116h-.4a2.8 2.8 0 0 0-2.8 2.8v.4a2.8 2.8 0 0 0 2.8 2.8h.4a2.8 2.8 0 0 0 2.8-2.8V6.673z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Audio24Icon.displayName = 'Audio24Icon';
var _default = Audio24Icon;
exports.default = _default;