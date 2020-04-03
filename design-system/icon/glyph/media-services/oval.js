"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesOvalIcon = function MediaServicesOvalIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M12 20c-4.943 0-9-3.55-9-8s4.057-8 9-8 9 3.55 9 8-4.057 8-9 8zm0-2c3.893 0 7-2.718 7-6s-3.107-6-7-6-7 2.718-7 6 3.107 6 7 6z\" fill=\"currentColor\"/></svg>"
  }, props));
};

MediaServicesOvalIcon.displayName = 'MediaServicesOvalIcon';
var _default = MediaServicesOvalIcon;
exports.default = _default;