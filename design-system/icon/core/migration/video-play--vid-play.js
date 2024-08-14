/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::154c04375f0a7d5c38092896786e16a2>>
 * @codegenCommand yarn build:icon-glyphs
 */
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
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for VideoPlayIcon.
 * This component is VideoPlayIcon, with `UNSAFE_fallbackIcon` set to "VidPlayIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
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