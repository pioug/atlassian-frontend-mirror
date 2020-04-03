"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Sketch48Icon = function Sketch48Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"48\" height=\"64\" viewBox=\"0 0 48 64\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><path fill=\"#FFF\" stroke=\"#091E42\" stroke-opacity=\".08\" d=\"M4 .5h28.007a3.5 3.5 0 0 1 2.52 1.072l11.994 12.45a3.5 3.5 0 0 1 .979 2.429V60a3.5 3.5 0 0 1-3.5 3.5H4A3.5 3.5 0 0 1 .5 60V4A3.5 3.5 0 0 1 4 .5z\"/><path fill=\"#FF8B00\" d=\"M24.034 41.333c-.336 0-.655-.144-.876-.396l-8.2-9.334a1.167 1.167 0 0 1-.095-1.418l3.12-4.667a1.17 1.17 0 0 1 .97-.518h10.314c.403 0 .778.209.991.55l2.9 4.667c.27.436.225.997-.111 1.383l-8.133 9.333a1.17 1.17 0 0 1-.877.4h-.003z\"/></g></svg>"
  }, props, {
    size: "xlarge"
  }));
};

Sketch48Icon.displayName = 'Sketch48Icon';
var _default = Sketch48Icon;
exports.default = _default;