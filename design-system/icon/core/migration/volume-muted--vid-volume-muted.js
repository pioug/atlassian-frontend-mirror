/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9dd67970bf6d0fbd204989e63be9d176>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for VolumeMutedIcon.
 * This component is VolumeMutedIcon, with `UNSAFE_fallbackIcon` set to "VidVolumeMutedIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const VolumeMutedIcon = props => /*#__PURE__*/_react.default.createElement(_volumeMuted.default, Object.assign({
  LEGACY_fallbackIcon: _vidVolumeMuted.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
VolumeMutedIcon.Name = 'VolumeMutedIconMigration';
var _default = exports.default = VolumeMutedIcon;