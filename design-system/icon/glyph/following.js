"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var FollowingIcon = function FollowingIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M20.99 6a.983.983 0 0 1-.286.7l-1.333 1.269 1.284 1.3a.982.982 0 0 1-.412 1.704.99.99 0 0 1-.98-.317l-1.976-1.969a.982.982 0 0 1 0-1.387l2.035-2.028a.99.99 0 0 1 1.077-.19c.365.16.598.522.592.918zM5 14c0-1.105.902-2 2.009-2h7.982c1.11 0 2.009.894 2.009 2.006v4.44c0 3.405-12 3.405-12 0V14z\"/><circle cx=\"11\" cy=\"7\" r=\"4\"/></g></svg>"
  }, props));
};

FollowingIcon.displayName = 'FollowingIcon';
var _default = FollowingIcon;
exports.default = _default;