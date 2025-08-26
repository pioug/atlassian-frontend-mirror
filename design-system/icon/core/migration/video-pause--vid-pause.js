/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b6e99bc67ab9aca63b78b01a6ef1a471>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _videoPause = _interopRequireDefault(require("@atlaskit/icon/core/video-pause"));
var _vidPause = _interopRequireDefault(require("@atlaskit/icon/glyph/vid-pause"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for VideoPauseIcon.
 * This component is VideoPauseIcon, with `UNSAFE_fallbackIcon` set to "VidPauseIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for pause video in Media.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const VideoPauseIcon = props => /*#__PURE__*/_react.default.createElement(_videoPause.default, Object.assign({
  name: "VideoPauseIcon",
  LEGACY_fallbackIcon: _vidPause.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
VideoPauseIcon.displayName = 'VideoPauseIconMigration';
var _default = exports.default = VideoPauseIcon;