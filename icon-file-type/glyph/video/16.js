"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Video16Icon = function Video16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#FF5630\" fill-rule=\"evenodd\" d=\"M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm11.37 10.954c.285.138.63-.05.63-.343V5.39c0-.293-.345-.481-.63-.343L11 6.194v3.613l2.37 1.147zM2 5.99v4.018c0 .54.449.991 1.003.991h4.994A.99.99 0 0 0 9 10.01V5.99C9 5.452 8.551 5 7.997 5H3.003A.99.99 0 0 0 2 5.99z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

Video16Icon.displayName = 'Video16Icon';
var _default = Video16Icon;
exports.default = _default;