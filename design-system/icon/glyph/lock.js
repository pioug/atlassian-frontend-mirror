"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const LockIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor"><path d="M16 11V9h-2V7.002A2 2 0 0 0 12 5c-1.102 0-2 .898-2 2.002V9H8v2H7v8h10v-8zm-2 0h-4V9h4zM8 9V7.002A4.004 4.004 0 0 1 12 3a4 4 0 0 1 4 4.002V9h.994A2.01 2.01 0 0 1 19 11.009v7.982c0 1.11-.897 2.009-2.006 2.009H7.006A2.01 2.01 0 0 1 5 18.991V11.01C5 9.899 5.897 9 7.006 9zm0 0h2v2H8zm6 0h2v2h-2z"/><circle cx="12" cy="15" r="2"/></g></svg>`
}, props));
LockIcon.displayName = 'LockIcon';
var _default = exports.default = LockIcon;