"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorLinkIcon = function EditorLinkIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M12.654 8.764a.858.858 0 0 1-1.213-1.213l1.214-1.214a3.717 3.717 0 0 1 5.257 0 3.714 3.714 0 0 1 .001 5.258l-1.214 1.214-.804.804a3.72 3.72 0 0 1-5.263.005.858.858 0 0 1 1.214-1.214c.781.782 2.05.78 2.836-.005l.804-.803 1.214-1.214a1.998 1.998 0 0 0-.001-2.831 2 2 0 0 0-2.83 0l-1.215 1.213zm-.808 6.472a.858.858 0 0 1 1.213 1.213l-1.214 1.214a3.717 3.717 0 0 1-5.257 0 3.714 3.714 0 0 1-.001-5.258l1.214-1.214.804-.804a3.72 3.72 0 0 1 5.263-.005.858.858 0 0 1-1.214 1.214 2.005 2.005 0 0 0-2.836.005l-.804.803L7.8 13.618a1.998 1.998 0 0 0 .001 2.831 2 2 0 0 0 2.83 0l1.215-1.213z\" fill=\"currentColor\"/></svg>"
  }, props));
};

EditorLinkIcon.displayName = 'EditorLinkIcon';
var _default = EditorLinkIcon;
exports.default = _default;