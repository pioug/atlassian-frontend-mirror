"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _lobbyBell = _interopRequireDefault(require("@atlaskit/icon/core/lobby-bell"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const HipchatLobbyIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor" fill-rule="evenodd"><path d="M5 14a7.002 7.002 0 0 1 13.858 0z"/><rect width="16" height="2" x="4" y="15" rx="1"/><path d="M11 7h2v3h-2z"/><rect width="4" height="1" x="10" y="6" rx=".5"/></g></svg>`
}, props, {
  newIcon: _lobbyBell.default
}));
HipchatLobbyIcon.displayName = 'HipchatLobbyIcon';
var _default = exports.default = HipchatLobbyIcon;