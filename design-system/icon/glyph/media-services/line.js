"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesLineIcon = function MediaServicesLineIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M4.36 17.904L17.904 4.36a1.228 1.228 0 1 1 1.736 1.736L6.096 19.64a1.228 1.228 0 1 1-1.736-1.736z\" fill=\"currentColor\"/></svg>"
  }, props));
};

MediaServicesLineIcon.displayName = 'MediaServicesLineIcon';
var _default = MediaServicesLineIcon;
exports.default = _default;