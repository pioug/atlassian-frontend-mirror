/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1144534192b52c0c57b7e0eb54b8a224>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _video = _interopRequireDefault(require("@atlaskit/icon/core/video"));
var _videoFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/video-filled"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for VideoIcon.
 * This component is VideoIcon, with `UNSAFE_fallbackIcon` set to "VideoFilledIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for video in Media.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const VideoIcon = props => /*#__PURE__*/_react.default.createElement(_video.default, Object.assign({
  LEGACY_fallbackIcon: _videoFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
VideoIcon.Name = 'VideoIconMigration';
var _default = exports.default = VideoIcon;