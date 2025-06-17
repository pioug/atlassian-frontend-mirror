/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d6384f464f0a5845294d9f9ecf767552>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _panelRight = _interopRequireDefault(require("@atlaskit/icon/core/panel-right"));
var _roomMenu = _interopRequireDefault(require("@atlaskit/icon/glyph/room-menu"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for PanelRightIcon.
 * This component is PanelRightIcon, with `UNSAFE_fallbackIcon` set to "RoomMenuIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for opening a preview panel to the right of the viewport edge. Use only for left-to-right languages.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PanelRightIcon = props => /*#__PURE__*/_react.default.createElement(_panelRight.default, Object.assign({
  LEGACY_fallbackIcon: _roomMenu.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PanelRightIcon.Name = 'PanelRightIconMigration';
var _default = exports.default = PanelRightIcon;