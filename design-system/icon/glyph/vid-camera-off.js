"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var VidCameraOffIcon = function VidCameraOffIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M5.586 7l-1.88-1.88a.996.996 0 0 1 .001-1.413.996.996 0 0 1 1.413-.002L20.123 18.71a.996.996 0 0 1-.002 1.412.996.996 0 0 1-1.412.002l-3.455-3.454c-.31.208-.693.331-1.11.331H4.856C3.83 17 3 16.253 3 15.331V8.67C3 7.747 3.83 7 4.856 7h.73zm14.623 8.994l-3.144-3.144V9.5l2.613-1.411c.137-.061.28-.089.421-.089.472 0 .901.316.901.753v6.494c0 .403-.365.703-.791.747zM11.214 7h2.93C15.17 7 16 7.747 16 8.669v3.117L11.214 7z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

VidCameraOffIcon.displayName = 'VidCameraOffIcon';
var _default = VidCameraOffIcon;
exports.default = _default;