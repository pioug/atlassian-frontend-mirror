/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::67ab2c5e7300003b7e06d5bf9636c1e4>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _volumeMuted = _interopRequireDefault(require("@atlaskit/icon/core/volume-muted"));
var _vidVolumeMuted = _interopRequireDefault(require("@atlaskit/icon/glyph/vid-volume-muted"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for VolumeMutedIcon.
 * This component is VolumeMutedIcon, with `UNSAFE_fallbackIcon` set to "VidVolumeMutedIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: 📦 @atlaskit/icon/core/volume-muted
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const VolumeMutedIcon = props => /*#__PURE__*/_react.default.createElement(_volumeMuted.default, Object.assign({
  name: "VolumeMutedIcon",
  LEGACY_fallbackIcon: _vidVolumeMuted.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
VolumeMutedIcon.displayName = 'VolumeMutedIconMigration';
var _default = exports.default = VolumeMutedIcon;