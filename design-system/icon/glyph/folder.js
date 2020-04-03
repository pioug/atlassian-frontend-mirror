"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var FolderIcon = function FolderIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M20 19V8h-9.154l-.503-1.258-.455-1.136C9.778 5.33 9.291 5 9.003 5H3.997C4.002 5 4 19 4 19h16zM12.2 6h7.809C21.109 6 22 6.893 22 7.992v11.016c0 1.1-.898 1.992-1.991 1.992H3.991C2.891 21 2 20.107 2 19.008V5.006C2 3.898 2.896 3 3.997 3h5.006c1.103 0 2.327.826 2.742 1.862L12.2 6z\" fill=\"currentColor\"/></svg>"
  }, props));
};

FolderIcon.displayName = 'FolderIcon';
var _default = FolderIcon;
exports.default = _default;