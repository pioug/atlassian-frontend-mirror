/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::696a579fbbc7f724d5a9cca4586343d0>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _strokeWeightSmall = _interopRequireDefault(require("@atlaskit/icon/core/stroke-weight-small"));
var _line = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/line"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for StrokeWeightSmallIcon.
 * This component is StrokeWeightSmallIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesLineIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for representing thin border stroke widths.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StrokeWeightSmallIcon = props => /*#__PURE__*/_react.default.createElement(_strokeWeightSmall.default, Object.assign({
  LEGACY_fallbackIcon: _line.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StrokeWeightSmallIcon.Name = 'StrokeWeightSmallIconMigration';
var _default = exports.default = StrokeWeightSmallIcon;