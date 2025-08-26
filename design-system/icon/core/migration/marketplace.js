/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7e1cb073a740edf0e357b6ec7d54b144>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _marketplace = _interopRequireDefault(require("@atlaskit/icon/core/marketplace"));
var _marketplace2 = _interopRequireDefault(require("@atlaskit/icon/glyph/marketplace"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for MarketplaceIcon.
 * This component is MarketplaceIcon, with `UNSAFE_fallbackIcon` set to "MarketplaceIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for Atlassian Marketplace.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MarketplaceIcon = props => /*#__PURE__*/_react.default.createElement(_marketplace.default, Object.assign({
  name: "MarketplaceIcon",
  LEGACY_fallbackIcon: _marketplace2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MarketplaceIcon.displayName = 'MarketplaceIconMigration';
var _default = exports.default = MarketplaceIcon;