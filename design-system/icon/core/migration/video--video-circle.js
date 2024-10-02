/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e4964785a456acdca1b61f07a8f603cb>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _video = _interopRequireDefault(require("@atlaskit/icon/core/video"));
var _videoCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/video-circle"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for VideoIcon.
 * This component is VideoIcon, with `UNSAFE_fallbackIcon` set to "VideoCircleIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for video in Media.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const VideoIcon = props => /*#__PURE__*/_react.default.createElement(_video.default, Object.assign({
  LEGACY_fallbackIcon: _videoCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
VideoIcon.Name = 'VideoIconMigration';
var _default = exports.default = VideoIcon;