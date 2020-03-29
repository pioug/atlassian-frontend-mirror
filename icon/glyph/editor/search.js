"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorSearchIcon = function EditorSearchIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M14.823 15.883a5.5 5.5 0 1 1 1.06-1.06l2.647 2.647c.293.293.53.59 0 1.06-.53.47-.767.293-1.06 0l-2.647-2.647zM11.5 15.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8z\" fill=\"currentColor\"/></svg>"
  }, props));
};

EditorSearchIcon.displayName = 'EditorSearchIcon';
var _default = EditorSearchIcon;
exports.default = _default;