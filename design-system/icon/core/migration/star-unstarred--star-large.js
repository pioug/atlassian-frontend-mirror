/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::06e8e30e16bc26ff309c040ffdd07415>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _starUnstarred = _interopRequireDefault(require("@atlaskit/icon/core/star-unstarred"));
var _starLarge = _interopRequireDefault(require("@atlaskit/icon/glyph/star-large"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for StarUnstarredIcon.
 * This component is StarUnstarredIcon, with `UNSAFE_fallbackIcon` set to "StarLargeIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for starring or favoriting objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StarUnstarredIcon = props => /*#__PURE__*/_react.default.createElement(_starUnstarred.default, Object.assign({
  LEGACY_fallbackIcon: _starLarge.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StarUnstarredIcon.Name = 'StarUnstarredIconMigration';
var _default = exports.default = StarUnstarredIcon;