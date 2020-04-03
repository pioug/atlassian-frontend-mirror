"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorMediaWrapRightIcon = function EditorMediaWrapRightIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M6 17h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2zm0-8h4a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2zm0 4h4a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2zm8-4h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zM6 5h12a1 1 0 0 1 0 2H6a1 1 0 1 1 0-2z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorMediaWrapRightIcon.displayName = 'EditorMediaWrapRightIcon';
var _default = EditorMediaWrapRightIcon;
exports.default = _default;