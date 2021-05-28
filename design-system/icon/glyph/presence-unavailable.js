"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PresenceUnavailableIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M6 12a6 6 0 1112 0 6 6 0 01-12 0z" fill="inherit"/><path d="M15 12a3 3 0 10-6 0 3 3 0 006 0zm-9 0a6 6 0 1112 0 6 6 0 01-12 0z" fill="currentColor"/></svg>`
}, props));

PresenceUnavailableIcon.displayName = 'PresenceUnavailableIcon';
var _default = PresenceUnavailableIcon;
exports.default = _default;