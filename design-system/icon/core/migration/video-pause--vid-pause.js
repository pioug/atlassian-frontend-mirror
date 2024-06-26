"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _videoPause = _interopRequireDefault(require("@atlaskit/icon/core/video-pause"));
var _vidPause = _interopRequireDefault(require("@atlaskit/icon/glyph/vid-pause"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for VideoPauseIcon.
 * This component is VideoPauseIcon, with `UNSAFE_fallbackIcon` set to "VidPauseIcon".
 *
 * Category: Single-purpose
 * Location: Icon contributions
 * Usage guidance: Reserved for pause video in Media.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const VideoPauseIcon = props => /*#__PURE__*/_react.default.createElement(_videoPause.default, Object.assign({
  LEGACY_fallbackIcon: _vidPause.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
VideoPauseIcon.Name = 'VideoPauseIconMigration';
var _default = exports.default = VideoPauseIcon;