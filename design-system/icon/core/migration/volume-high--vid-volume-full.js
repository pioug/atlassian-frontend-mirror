/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a79f159cce0a7a272c311445e154d6a1>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _volumeHigh = _interopRequireDefault(require("@atlaskit/icon/core/volume-high"));
var _vidVolumeFull = _interopRequireDefault(require("@atlaskit/icon/glyph/vid-volume-full"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for VolumeHighIcon.
 * This component is VolumeHighIcon, with `UNSAFE_fallbackIcon` set to "VidVolumeFullIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: 📦 @atlaskit/icon/core/volume-high
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const VolumeHighIcon = props => /*#__PURE__*/_react.default.createElement(_volumeHigh.default, Object.assign({
  LEGACY_fallbackIcon: _vidVolumeFull.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
VolumeHighIcon.Name = 'VolumeHighIconMigration';
var _default = exports.default = VolumeHighIcon;