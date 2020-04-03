"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Folder16Icon = function Folder16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><g fill=\"#B3D4FF\" fill-rule=\"evenodd\"><path d=\"M6.667 3H15a1 1 0 0 1 1 1v10.05a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4.667a1 1 0 0 1 1 1z\"/><path d=\"M0 4.05h16v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-10z\" style=\"mix-blend-mode:multiply\"/></g></svg>"
  }, props, {
    size: "small"
  }));
};

Folder16Icon.displayName = 'Folder16Icon';
var _default = Folder16Icon;
exports.default = _default;