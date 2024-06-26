"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _zoomOut = _interopRequireDefault(require("@atlaskit/icon/core/zoom-out"));
var _zoomOut2 = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/zoom-out"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ZoomOutIcon.
 * This component is ZoomOutIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesZoomOutIcon".
 *
 * Category: Single-purpose
 * Location: Icon contributions
 * Usage guidance: Reserved for zooming out of an object or view.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ZoomOutIcon = props => /*#__PURE__*/_react.default.createElement(_zoomOut.default, Object.assign({
  LEGACY_fallbackIcon: _zoomOut2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ZoomOutIcon.Name = 'ZoomOutIconMigration';
var _default = exports.default = ZoomOutIcon;