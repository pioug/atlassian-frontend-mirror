"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PullRequest24Icon = function PullRequest24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#36B37E\" fill-rule=\"evenodd\" d=\"M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm4 3C5.4 3 4 4.3 4 6c0 1.3.8 2.4 2 2.8V20c0 .6.4 1 1 1s1-.4 1-1V8.8c1.2-.4 2-1.5 2-2.8 0-1.7-1.3-3-3-3zm7.414 2H15a3 3 0 0 1 3 3v7.17a3.001 3.001 0 1 1-2 0V8a1 1 0 0 0-1-1h-.583l.292.292a.999.999 0 1 1-1.413 1.415l-2.002-2a1 1 0 0 1-.001-1.415l2.003-2.002a.998.998 0 0 1 1.414 0 1 1 0 0 1-.001 1.415L14.414 5zM7 7c-.5 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm10 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

PullRequest24Icon.displayName = 'PullRequest24Icon';
var _default = PullRequest24Icon;
exports.default = _default;