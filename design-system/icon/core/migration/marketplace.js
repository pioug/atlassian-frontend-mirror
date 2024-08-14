/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ea1451b9db3a6faa0b6dc8e2e318d994>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for MarketplaceIcon.
 * This component is MarketplaceIcon, with `UNSAFE_fallbackIcon` set to "MarketplaceIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for Atlassian Marketplace.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MarketplaceIcon = props => /*#__PURE__*/_react.default.createElement(_marketplace.default, Object.assign({
  LEGACY_fallbackIcon: _marketplace2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MarketplaceIcon.Name = 'MarketplaceIconMigration';
var _default = exports.default = MarketplaceIcon;