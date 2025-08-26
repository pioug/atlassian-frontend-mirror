/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7c08a2b57cc7c52599e13eeb32385700>>
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for VideoPlayIcon.
 * This component is VideoPlayIcon, with `UNSAFE_fallbackIcon` set to "VidPlayIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for play video in Media.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const VideoPlayIcon = props => /*#__PURE__*/_react.default.createElement(_videoPlay.default, Object.assign({
  name: "VideoPlayIcon",
  LEGACY_fallbackIcon: _vidPlay.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
VideoPlayIcon.displayName = 'VideoPlayIconMigration';
var _default = exports.default = VideoPlayIcon;