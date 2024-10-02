/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::35cf7698fe185c1be1b9fc5617f3936c>>
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
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
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
  LEGACY_fallbackIcon: _zoomOut2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ZoomOutIcon.Name = 'ZoomOutIconMigration';
var _default = exports.default = ZoomOutIcon;