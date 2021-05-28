"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FollowingIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M20.99 6a.983.983 0 01-.286.7l-1.333 1.269 1.284 1.3a.982.982 0 01-.412 1.704.99.99 0 01-.98-.317l-1.976-1.969a.982.982 0 010-1.387l2.035-2.028a.99.99 0 011.077-.19c.365.16.598.522.592.918zM5 14c0-1.105.902-2 2.009-2h7.982c1.11 0 2.009.894 2.009 2.006v4.44c0 3.405-12 3.405-12 0V14z"/><circle cx="11" cy="7" r="4"/></g></svg>`
}, props));

FollowingIcon.displayName = 'FollowingIcon';
var _default = FollowingIcon;
exports.default = _default;