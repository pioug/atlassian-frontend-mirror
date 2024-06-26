"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _zoomIn = _interopRequireDefault(require("@atlaskit/icon/core/zoom-in"));
var _zoomIn2 = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/zoom-in"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ZoomInIcon.
 * This component is ZoomInIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesZoomInIcon".
 *
 * Category: Single-purpose
 * Location: Icon contributions
 * Usage guidance: Reserved for zooming in of an object or view.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ZoomInIcon = props => /*#__PURE__*/_react.default.createElement(_zoomIn.default, Object.assign({
  LEGACY_fallbackIcon: _zoomIn2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ZoomInIcon.Name = 'ZoomInIconMigration';
var _default = exports.default = ZoomInIcon;