"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Folder48Icon = function Folder48Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"48\" height=\"64\" viewBox=\"0 0 48 64\" focusable=\"false\" role=\"presentation\"><g fill=\"#B3D4FF\" fill-rule=\"evenodd\"><path d=\"M20 16h24a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4z\"/><path d=\"M0 20h48v28a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V20z\" style=\"mix-blend-mode:multiply\"/></g></svg>"
  }, props, {
    size: "xlarge"
  }));
};

Folder48Icon.displayName = 'Folder48Icon';
var _default = Folder48Icon;
exports.default = _default;