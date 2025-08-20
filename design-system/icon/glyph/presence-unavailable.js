"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const PresenceUnavailableIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="inherit" d="M6 12a6 6 0 1 1 12 0 6 6 0 0 1-12 0"/><path fill="currentcolor" d="M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0m-9 0a6 6 0 1 1 12 0 6 6 0 0 1-12 0"/></svg>`
}, props));
PresenceUnavailableIcon.displayName = 'PresenceUnavailableIcon';
var _default = exports.default = PresenceUnavailableIcon;