"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorRecentIcon = function EditorRecentIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M11.305 12.282c.037.09.091.175.165.248l2 2a.75.75 0 0 0 1.06-1.06l-1.78-1.78V9a.75.75 0 1 0-1.5 0v3c0 .104.021.202.059.292zM12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorRecentIcon.displayName = 'EditorRecentIcon';
var _default = EditorRecentIcon;
exports.default = _default;