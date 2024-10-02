/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7abb6cf17310710e3a4ea7d0c8b8ff28>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _volumeLow = _interopRequireDefault(require("@atlaskit/icon/core/volume-low"));
var _vidVolumeHalf = _interopRequireDefault(require("@atlaskit/icon/glyph/vid-volume-half"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for VolumeLowIcon.
 * This component is VolumeLowIcon, with `UNSAFE_fallbackIcon` set to "VidVolumeHalfIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: 📦 @atlaskit/icon/core/volume-low
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const VolumeLowIcon = props => /*#__PURE__*/_react.default.createElement(_volumeLow.default, Object.assign({
  LEGACY_fallbackIcon: _vidVolumeHalf.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
VolumeLowIcon.Name = 'VolumeLowIconMigration';
var _default = exports.default = VolumeLowIcon;