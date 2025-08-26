/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b4086e75332955510ed2f144ae74452d>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _quotationMark = _interopRequireDefault(require("@atlaskit/icon/core/quotation-mark"));
var _quote = _interopRequireDefault(require("@atlaskit/icon/glyph/quote"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for QuotationMarkIcon.
 * This component is QuotationMarkIcon, with `UNSAFE_fallbackIcon` set to "QuoteIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: blockquote, comment, testimonial, blogs in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const QuotationMarkIcon = props => /*#__PURE__*/_react.default.createElement(_quotationMark.default, Object.assign({
  name: "QuotationMarkIcon",
  LEGACY_fallbackIcon: _quote.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
QuotationMarkIcon.displayName = 'QuotationMarkIconMigration';
var _default = exports.default = QuotationMarkIcon;