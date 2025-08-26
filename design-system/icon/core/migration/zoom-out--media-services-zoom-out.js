/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::363db5da4e4475f50ec8c5ba07a44641>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _zoomOut = _interopRequireDefault(require("@atlaskit/icon/core/zoom-out"));
var _zoomOut2 = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/zoom-out"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ZoomOutIcon.
 * This component is ZoomOutIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesZoomOutIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for zooming out of an object or view.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ZoomOutIcon = props => /*#__PURE__*/_react.default.createElement(_zoomOut.default, Object.assign({
  name: "ZoomOutIcon",
  LEGACY_fallbackIcon: _zoomOut2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ZoomOutIcon.displayName = 'ZoomOutIconMigration';
var _default = exports.default = ZoomOutIcon;