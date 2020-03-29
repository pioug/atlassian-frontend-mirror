"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesActualSizeIcon = function MediaServicesActualSizeIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M16.587 6.003H15A1 1 0 1 1 15 4h3.9l.047.001a.975.975 0 0 1 .736.285l.032.032c.2.2.296.47.284.736l.001.048v3.896a1 1 0 1 1-2 0V7.411l-3.309 3.308a.977.977 0 0 1-1.374-.005l-.032-.032a.976.976 0 0 1-.005-1.374l3.307-3.305zM7.413 17.997H9A1 1 0 1 1 9 20H5.1l-.047-.001a.975.975 0 0 1-.736-.285l-.032-.032A.977.977 0 0 1 4 18.946a1.12 1.12 0 0 1 0-.048v-3.896a1 1 0 1 1 2 0v1.587l3.309-3.308a.977.977 0 0 1 1.374.005l.032.032a.976.976 0 0 1 .005 1.374l-3.307 3.305z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

MediaServicesActualSizeIcon.displayName = 'MediaServicesActualSizeIcon';
var _default = MediaServicesActualSizeIcon;
exports.default = _default;