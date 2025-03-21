"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _attachment = _interopRequireDefault(require("@atlaskit/icon/core/attachment"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const AttachmentIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M11.643 17.965c-1.53 1.495-4.016 1.496-5.542.004a3.773 3.773 0 0 1 .002-5.412l7.147-6.985a2.316 2.316 0 0 1 3.233-.003c.893.873.895 2.282.004 3.153l-6.703 6.55a.653.653 0 0 1-.914-.008.62.62 0 0 1 0-.902l6.229-6.087a.94.94 0 0 0 0-1.353.995.995 0 0 0-1.384 0l-6.23 6.087a2.5 2.5 0 0 0 0 3.607 2.643 2.643 0 0 0 3.683.009l6.703-6.55a4.074 4.074 0 0 0-.003-5.859 4.306 4.306 0 0 0-6.002.003l-7.148 6.985a5.655 5.655 0 0 0-.001 8.118c2.29 2.239 6.015 2.238 8.31-.005l6.686-6.533a.94.94 0 0 0 0-1.353.995.995 0 0 0-1.384 0z"/></svg>`
}, props, {
  newIcon: _attachment.default
}));
AttachmentIcon.displayName = 'AttachmentIcon';
var _default = exports.default = AttachmentIcon;