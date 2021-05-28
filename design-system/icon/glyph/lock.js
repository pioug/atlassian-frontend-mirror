"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LockIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor"><path d="M16 11V9h-2V7.002A2.001 2.001 0 0012 5c-1.102 0-2 .898-2 2.002V9H8v2H7v8h10v-8h-1zm-2 0h-4V9h4v2zM8 9V7.002A4.004 4.004 0 0112 3a4 4 0 014 4.002V9h.994A2.01 2.01 0 0119 11.009v7.982c0 1.11-.897 2.009-2.006 2.009H7.006A2.009 2.009 0 015 18.991V11.01C5 9.899 5.897 9 7.006 9H8zm0 0h2v2H8V9zm6 0h2v2h-2V9z"/><circle cx="12" cy="15" r="2"/></g></svg>`
}, props));

LockIcon.displayName = 'LockIcon';
var _default = LockIcon;
exports.default = _default;