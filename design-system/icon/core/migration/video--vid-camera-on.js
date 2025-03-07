/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::11768438686ca4379c5d612b23881617>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _video = _interopRequireDefault(require("@atlaskit/icon/core/video"));
var _vidCameraOn = _interopRequireDefault(require("@atlaskit/icon/glyph/vid-camera-on"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for VideoIcon.
 * This component is VideoIcon, with `UNSAFE_fallbackIcon` set to "VidCameraOnIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for representing video content across Atlassian and Loom.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const VideoIcon = props => /*#__PURE__*/_react.default.createElement(_video.default, Object.assign({
  LEGACY_fallbackIcon: _vidCameraOn.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
VideoIcon.Name = 'VideoIconMigration';
var _default = exports.default = VideoIcon;