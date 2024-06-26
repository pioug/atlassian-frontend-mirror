"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _creditCard = _interopRequireDefault(require("@atlaskit/icon/core/credit-card"));
var _creditcard = _interopRequireDefault(require("@atlaskit/icon/glyph/creditcard"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for CreditCardIcon.
 * This component is CreditCardIcon, with `UNSAFE_fallbackIcon` set to "CreditcardIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: billing in Admin, invoices in PPC, payments.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CreditCardIcon = props => /*#__PURE__*/_react.default.createElement(_creditCard.default, Object.assign({
  LEGACY_fallbackIcon: _creditcard.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CreditCardIcon.Name = 'CreditCardIconMigration';
var _default = exports.default = CreditCardIcon;