"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _linkBroken = _interopRequireDefault(require("@atlaskit/icon/core/link-broken"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EditorUnlinkIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" d="M5 10V9h2v1zm4-5h1v2H9zm7.646 12.354.708-.708 2 2-.708.708zM17 15v-1h2v1zm-3 2h1v2h-1zM7.354 6.646l-.708.708-2-2 .708-.708zm3.567 9.037 1.061-1.062a.75.75 0 1 1 1.06 1.061l-1.06 1.061a3.25 3.25 0 0 1-4.596 0 3.247 3.247 0 0 1 0-4.596l1.06-1.061.703-.703c.793-.63 1.773.35 1.06 1.06l-.702.703-1.06 1.062a1.747 1.747 0 0 0 0 2.474 1.75 1.75 0 0 0 2.474 0m2.658-7.608-1.061 1.061a.75.75 0 0 1-1.06-1.06l1.06-1.062a3.25 3.25 0 0 1 4.596 0 3.247 3.247 0 0 1 0 4.596l-1.06 1.062-.703.702c-.565.565-1.581-.45-1.06-1.06l.702-.703 1.06-1.061a1.747 1.747 0 0 0 0-2.475 1.75 1.75 0 0 0-2.474 0"/></svg>`
}, props, {
  newIcon: _linkBroken.default
}));
EditorUnlinkIcon.displayName = 'EditorUnlinkIcon';
var _default = exports.default = EditorUnlinkIcon;