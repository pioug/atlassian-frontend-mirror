"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Spreadsheet24Icon = function Spreadsheet24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#36B37E\" fill-rule=\"evenodd\" d=\"M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm2 5a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2H5zm0 4a1 1 0 1 0 0 2h3a1 1 0 0 0 0-2H5zm0 4a1 1 0 0 0 0 2h3a1 1 0 0 0 0-2H5zm0 4a1 1 0 0 0 0 2h3a1 1 0 0 0 0-2H5zm7-12a1 1 0 0 0 0 2h7a1 1 0 0 0 0-2h-7zm0 4a1 1 0 0 0 0 2h7a1 1 0 0 0 0-2h-7zm0 4a1 1 0 0 0 0 2h7a1 1 0 0 0 0-2h-7zm0 4a1 1 0 0 0 0 2h7a1 1 0 0 0 0-2h-7z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Spreadsheet24Icon.displayName = 'Spreadsheet24Icon';
var _default = Spreadsheet24Icon;
exports.default = _default;