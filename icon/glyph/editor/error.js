"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorErrorIcon = function EditorErrorIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M13.485 11.929l2.122-2.121a1 1 0 0 0-1.415-1.415l-2.12 2.122L9.95 8.393a1 1 0 0 0-1.414 1.415l2.12 2.12-2.12 2.122a1 1 0 0 0 1.414 1.414l2.121-2.12 2.121 2.12a1 1 0 1 0 1.415-1.414l-2.122-2.121zM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorErrorIcon.displayName = 'EditorErrorIcon';
var _default = EditorErrorIcon;
exports.default = _default;