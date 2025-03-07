/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::93e6e19651ada7306bb6a5fa80edf8fa>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _borderWeightThin = _interopRequireDefault(require("@atlaskit/icon/core/border-weight-thin"));
var _line = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/line"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for BorderWeightThinIcon.
 * This component is BorderWeightThinIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesLineIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for representing thin border stroke widths.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const BorderWeightThinIcon = props => /*#__PURE__*/_react.default.createElement(_borderWeightThin.default, Object.assign({
  LEGACY_fallbackIcon: _line.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
BorderWeightThinIcon.Name = 'BorderWeightThinIconMigration';
var _default = exports.default = BorderWeightThinIcon;