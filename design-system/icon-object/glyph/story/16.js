"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Story16Icon = function Story16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#36B37E\" fill-rule=\"evenodd\" d=\"M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm6 11l-2.863 1.822c-.42.38-1.137.111-1.137-.427v-8.19C4 3.54 4.596 3 5.333 3h5.334C11.403 3 12 3.539 12 4.206v8.19c0 .537-.719.806-1.139.426L8 11zm0-2.371l2 1.274V5H6v4.902L8 8.63z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

Story16Icon.displayName = 'Story16Icon';
var _default = Story16Icon;
exports.default = _default;