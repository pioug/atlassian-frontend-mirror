"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Folder24Icon = function Folder24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"#B3D4FF\" fill-rule=\"evenodd\"><path d=\"M10 4h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2z\"/><path d=\"M0 6h24v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6z\" style=\"mix-blend-mode:multiply\"/></g></svg>"
  }, props, {
    size: "medium"
  }));
};

Folder24Icon.displayName = 'Folder24Icon';
var _default = Folder24Icon;
exports.default = _default;