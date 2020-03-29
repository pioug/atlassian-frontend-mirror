"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var CameraIcon = function CameraIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M2 6.994C2 5.893 2.898 5 3.99 5h16.02C21.108 5 22 5.895 22 6.994v12.012A1.997 1.997 0 0 1 20.01 21H3.99A1.994 1.994 0 0 1 2 19.006V6.994zM4 7v12h16V7H4z\"/><path d=\"M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z\" fill-rule=\"nonzero\"/><path d=\"M8 4c0-.552.453-1 .997-1h6.006c.55 0 .997.444.997 1v1H8V4z\"/><rect x=\"17\" y=\"8\" width=\"2\" height=\"2\" rx=\"1\"/></g></svg>"
  }, props));
};

CameraIcon.displayName = 'CameraIcon';
var _default = CameraIcon;
exports.default = _default;