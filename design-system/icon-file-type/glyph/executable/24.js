"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Executable24Icon = function Executable24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#5E6C84\" fill-rule=\"evenodd\" d=\"M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm2 13v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5H5zm1.883-8a1 1 0 0 0-.992.876L5 13h14l-.89-7.124A1 1 0 0 0 17.116 5H6.883zM8 15h8a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Executable24Icon.displayName = 'Executable24Icon';
var _default = Executable24Icon;
exports.default = _default;