"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const RecentIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M11 8.002v4.002c0 .28.116.53.301.712l2.47 2.47a1.003 1.003 0 0 0 1.414 0 1.003 1.003 0 0 0 0-1.415L13 11.586V6a1 1 0 0 0-2 0zM12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10"/></svg>`
}, props));
RecentIcon.displayName = 'RecentIcon';
var _default = exports.default = RecentIcon;