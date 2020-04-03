"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ScheduleIcon = function ScheduleIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M19 10.341V7.006A2 2 0 0 0 17.006 5H4.994A2 2 0 0 0 3 7.006v9.988A2 2 0 0 0 4.994 19h6.809a5.96 5.96 0 0 1-.72-2.001c-3.028 0-6.083-.002-6.083-.005C5 16.994 5 7 4.994 7 4.994 7 17 7 17 7.006V10c.701 0 1.374.12 2 .341z\" fill-rule=\"nonzero\"/><path d=\"M5 4v1h2V4a1 1 0 0 0-2 0zm10 0v1h2V4a1 1 0 0 0-2 0zM4 7h14v2H4zm14 8v-1.01a1 1 0 0 0-1-.99c-.556 0-1 .444-1 .99V15h-1.01a1 1 0 0 0-.99 1c0 .556.444 1 .99 1H16v1.01a1 1 0 0 0 1 .99c.556 0 1-.444 1-.99V17h1.01a1 1 0 0 0 .99-1c0-.556-.444-1-.99-1H18zm-1 6a5 5 0 1 1 0-10 5 5 0 0 1 0 10z\"/></g></svg>"
  }, props));
};

ScheduleIcon.displayName = 'ScheduleIcon';
var _default = ScheduleIcon;
exports.default = _default;