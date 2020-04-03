"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DetailViewIcon = function DetailViewIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M14 17h6c.003 0 0-9.994 0-9.994C20 7 14 7 14 7v10zM12 5h8c1.105 0 2 .897 2 2.006v9.988A1.998 1.998 0 0 1 20 19h-8V5zM2 7h8V5H2.997A.996.996 0 0 0 2 6v1zm0 4h8V9H2zm0 7c0 .552.453 1 .997 1H10v-2H2v1zm0-3h8v-2H2z\" fill=\"currentColor\"/></svg>"
  }, props));
};

DetailViewIcon.displayName = 'DetailViewIcon';
var _default = DetailViewIcon;
exports.default = _default;