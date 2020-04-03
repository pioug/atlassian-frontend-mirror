"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Problem16Icon = function Problem16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#FF5630\" fill-rule=\"evenodd\" d=\"M5.968 11.446l5.478-5.478a4 4 0 0 1-5.478 5.478zm-.796-.618zm-.618-.796a4 4 0 0 1 5.478-5.478l-5.478 5.478zm6.274-4.86zM2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm6 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

Problem16Icon.displayName = 'Problem16Icon';
var _default = Problem16Icon;
exports.default = _default;