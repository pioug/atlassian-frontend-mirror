"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var FollowersIcon = function FollowersIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M5 14c0-1.105.902-2 2.009-2h7.982c1.11 0 2.009.894 2.009 2.006v4.44c0 3.405-12 3.405-12 0V14z\"/><circle cx=\"11\" cy=\"7\" r=\"4\"/><path d=\"M17.293 9.293a1 1 0 1 0 1.414 1.414l1.996-1.996a.999.999 0 0 0 0-1.422l-1.996-1.996a1 1 0 0 0-1.414 1.414L18.586 8l-1.293 1.293z\" fill-rule=\"nonzero\"/></g></svg>"
  }, props));
};

FollowersIcon.displayName = 'FollowersIcon';
var _default = FollowersIcon;
exports.default = _default;