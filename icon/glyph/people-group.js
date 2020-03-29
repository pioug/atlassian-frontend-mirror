"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PeopleGroupIcon = function PeopleGroupIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M8.126 10H4c-1.113 0-2 .895-2 2v3.73c0 1.31 1.874 2.053 4 2.23v-2.964A3.002 3.002 0 0 1 9 12h.354a4 4 0 0 1-1.228-2zm7.748 0H20c1.105 0 2 .885 2 2v3.73c0 1.31-1.874 2.053-4 2.23v-2.964A3 3 0 0 0 15 12h-.354a4 4 0 0 0 1.228-2zM9.967 5.554a3 3 0 1 0-1.963 3.274 3.999 3.999 0 0 1 1.963-3.274zm6.03 3.274a3 3 0 1 0-1.963-3.276 3.994 3.994 0 0 1 1.963 3.276z\"/><path d=\"M7 15c0-1.105.887-2 2-2h6c1.105 0 2 .885 2 2v3.73c0 3.027-10 3.027-10 0V15z\"/><circle cx=\"12\" cy=\"9\" r=\"3\"/></g></svg>"
  }, props));
};

PeopleGroupIcon.displayName = 'PeopleGroupIcon';
var _default = PeopleGroupIcon;
exports.default = _default;