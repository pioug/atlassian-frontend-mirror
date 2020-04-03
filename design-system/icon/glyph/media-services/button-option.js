"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesButtonOptionIcon = function MediaServicesButtonOptionIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M13.29 10.234l-3.059 3.059c-.391.392-.264.71.285.71h2.988a.492.492 0 0 0 .496-.497v-2.988c0-.334-.118-.509-.299-.509-.116 0-.259.072-.411.225z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

MediaServicesButtonOptionIcon.displayName = 'MediaServicesButtonOptionIcon';
var _default = MediaServicesButtonOptionIcon;
exports.default = _default;