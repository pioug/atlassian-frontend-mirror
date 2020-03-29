"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SwitcherIcon = function SwitcherIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\"><path d=\"M3.507 15H16.5c-.007 0-.007-10-.007-10H3.5c.007 0 .007 10 .007 10zM1.5 4.994C1.5 3.893 2.263 3 3.192 3h13.616c.934 0 1.692.895 1.692 1.994v10.012c0 1.101-.763 1.994-1.692 1.994H3.192c-.934 0-1.692-.895-1.692-1.994V4.994zM6.5 5v10h2V5h-2zm5 0v10h2V5h-2z\"/><path d=\"M20.5 5h.006c1.101 0 1.994.895 1.994 1.994v12.012A1.995 1.995 0 0 1 20.506 21H8.494A1.995 1.995 0 0 1 6.5 19.006V19h13c.555 0 1-.448 1-1V5z\"/></g></svg>"
  }, props));
};

SwitcherIcon.displayName = 'SwitcherIcon';
var _default = SwitcherIcon;
exports.default = _default;