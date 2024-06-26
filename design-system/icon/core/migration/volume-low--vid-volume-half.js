"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _volumeLow = _interopRequireDefault(require("@atlaskit/icon/core/volume-low"));
var _vidVolumeHalf = _interopRequireDefault(require("@atlaskit/icon/glyph/vid-volume-half"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for VolumeLowIcon.
 * This component is VolumeLowIcon, with `UNSAFE_fallbackIcon` set to "VidVolumeHalfIcon".
 *
 * Category: Multi-purpose
 * Location: Icon contributions
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const VolumeLowIcon = props => /*#__PURE__*/_react.default.createElement(_volumeLow.default, Object.assign({
  LEGACY_fallbackIcon: _vidVolumeHalf.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
VolumeLowIcon.Name = 'VolumeLowIconMigration';
var _default = exports.default = VolumeLowIcon;