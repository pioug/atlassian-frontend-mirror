/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::bf4dd9d0a11241bd81112c2f7135ad3d>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _premium = _interopRequireDefault(require("@atlaskit/icon/core/premium"));
var _premium2 = _interopRequireDefault(require("@atlaskit/icon/glyph/premium"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for PremiumIcon.
 * This component is PremiumIcon, with `UNSAFE_fallbackIcon` set to "PremiumIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for premium features.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PremiumIcon = props => /*#__PURE__*/_react.default.createElement(_premium.default, Object.assign({
  name: "PremiumIcon",
  LEGACY_fallbackIcon: _premium2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PremiumIcon.displayName = 'PremiumIconMigration';
var _default = exports.default = PremiumIcon;