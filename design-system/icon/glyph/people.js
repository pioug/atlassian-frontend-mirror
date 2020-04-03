"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PeopleIcon = function PeopleIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><circle cx=\"16\" cy=\"9\" r=\"3\"/><circle cx=\"8\" cy=\"6\" r=\"3\"/><path d=\"M11 15c0-1.105.887-2 2-2h6c1.105 0 2 .885 2 2v3.73c0 3.027-10 3.027-10 0V15z\"/><path d=\"M13 12a1.997 1.997 0 0 0-2-2H5c-1.113 0-2 .897-2 2.003v3.826c0 1.921 4.054 2.518 7 1.984v-2.807A3.001 3.001 0 0 1 12.997 12H13z\"/></g></svg>"
  }, props));
};

PeopleIcon.displayName = 'PeopleIcon';
var _default = PeopleIcon;
exports.default = _default;