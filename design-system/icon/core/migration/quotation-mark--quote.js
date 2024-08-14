/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c731e0dd4caae46936d1f43086afdd10>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for QuotationMarkIcon.
 * This component is QuotationMarkIcon, with `UNSAFE_fallbackIcon` set to "QuoteIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: blockquote, comment, testimonial, blogs in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const QuotationMarkIcon = props => /*#__PURE__*/_react.default.createElement(_quotationMark.default, Object.assign({
  LEGACY_fallbackIcon: _quote.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
QuotationMarkIcon.Name = 'QuotationMarkIconMigration';
var _default = exports.default = QuotationMarkIcon;