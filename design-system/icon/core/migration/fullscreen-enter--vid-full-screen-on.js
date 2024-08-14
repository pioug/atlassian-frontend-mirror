/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c1e332ff7fd4ea89a01e642f0404e01a>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _fullscreenEnter = _interopRequireDefault(require("@atlaskit/icon/core/fullscreen-enter"));
var _vidFullScreenOn = _interopRequireDefault(require("@atlaskit/icon/glyph/vid-full-screen-on"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for FullscreenEnterIcon.
 * This component is FullscreenEnterIcon, with `UNSAFE_fallbackIcon` set to "VidFullScreenOnIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for full screen videos or objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FullscreenEnterIcon = props => /*#__PURE__*/_react.default.createElement(_fullscreenEnter.default, Object.assign({
  LEGACY_fallbackIcon: _vidFullScreenOn.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FullscreenEnterIcon.Name = 'FullscreenEnterIconMigration';
var _default = exports.default = FullscreenEnterIcon;