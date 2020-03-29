"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorOpenIcon = function EditorOpenIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M9.873 7.63c-.28 0-.344.159-.147.357l2.436 2.436-4.386 4.386a.509.509 0 0 0 0 .713l.7.7a.495.495 0 0 0 .713.001l4.387-4.386 2.436 2.436c.197.197.357.124.357-.147V8.133a.507.507 0 0 0-.503-.503H9.873z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorOpenIcon.displayName = 'EditorOpenIcon';
var _default = EditorOpenIcon;
exports.default = _default;