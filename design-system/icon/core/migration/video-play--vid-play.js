"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _videoPlay = _interopRequireDefault(require("@atlaskit/icon/core/video-play"));
var _vidPlay = _interopRequireDefault(require("@atlaskit/icon/glyph/vid-play"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for VideoPlayIcon.
 * This component is VideoPlayIcon, with `UNSAFE_fallbackIcon` set to "VidPlayIcon".
 *
 * Category: Single-purpose
 * Location: Icon contributions
 * Usage guidance: Reserved for play video in Media.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const VideoPlayIcon = props => /*#__PURE__*/_react.default.createElement(_videoPlay.default, Object.assign({
  LEGACY_fallbackIcon: _vidPlay.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
VideoPlayIcon.Name = 'VideoPlayIconMigration';
var _default = exports.default = VideoPlayIcon;