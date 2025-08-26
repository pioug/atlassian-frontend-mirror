/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::423b9145cfca34a16d15e97e058708ca>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _starStarred = _interopRequireDefault(require("@atlaskit/icon/core/star-starred"));
var _starFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/star-filled"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for StarStarredIcon.
 * This component is StarStarredIcon, with `UNSAFE_fallbackIcon` set to "StarFilledIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for starred or favourited objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StarStarredIcon = props => /*#__PURE__*/_react.default.createElement(_starStarred.default, Object.assign({
  name: "StarStarredIcon",
  LEGACY_fallbackIcon: _starFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StarStarredIcon.displayName = 'StarStarredIconMigration';
var _default = exports.default = StarStarredIcon;