/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f78ae834e38f7222125e67ab120cd784>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _video = _interopRequireDefault(require("@atlaskit/icon/core/video"));
var _video2 = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/video"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for VideoIcon.
 * This component is VideoIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesVideoIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for video in Media.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const VideoIcon = props => /*#__PURE__*/_react.default.createElement(_video.default, Object.assign({
  LEGACY_fallbackIcon: _video2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
VideoIcon.Name = 'VideoIconMigration';
var _default = exports.default = VideoIcon;