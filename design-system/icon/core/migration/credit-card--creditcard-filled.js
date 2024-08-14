/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::29d0e781e969f93aded1350ba7d2825d>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _creditCard = _interopRequireDefault(require("@atlaskit/icon/core/credit-card"));
var _creditcardFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/creditcard-filled"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CreditCardIcon.
 * This component is CreditCardIcon, with `UNSAFE_fallbackIcon` set to "CreditcardFilledIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: billing in Admin, invoices in PPC, payments.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CreditCardIcon = props => /*#__PURE__*/_react.default.createElement(_creditCard.default, Object.assign({
  LEGACY_fallbackIcon: _creditcardFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CreditCardIcon.Name = 'CreditCardIconMigration';
var _default = exports.default = CreditCardIcon;