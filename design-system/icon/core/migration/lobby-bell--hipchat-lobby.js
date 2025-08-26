/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7c3882892bfa77a852a2aa271c5eea3c>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _lobbyBell = _interopRequireDefault(require("@atlaskit/icon/core/lobby-bell"));
var _lobby = _interopRequireDefault(require("@atlaskit/icon/glyph/hipchat/lobby"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for LobbyBellIcon.
 * This component is LobbyBellIcon, with `UNSAFE_fallbackIcon` set to "HipchatLobbyIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: risks in Atlas.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LobbyBellIcon = props => /*#__PURE__*/_react.default.createElement(_lobbyBell.default, Object.assign({
  name: "LobbyBellIcon",
  LEGACY_fallbackIcon: _lobby.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LobbyBellIcon.displayName = 'LobbyBellIconMigration';
var _default = exports.default = LobbyBellIcon;