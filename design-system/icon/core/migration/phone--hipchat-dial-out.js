"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _phone = _interopRequireDefault(require("@atlaskit/icon/core/phone"));
var _dialOut = _interopRequireDefault(require("@atlaskit/icon/glyph/hipchat/dial-out"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for PhoneIcon.
 * This component is PhoneIcon, with `UNSAFE_fallbackIcon` set to "HipchatDialOutIcon".
 *
 * Category: Multi-purpose
 * Location: Icon contributions
 * Usage guidance: Known uses: call us, phone number input.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PhoneIcon = props => /*#__PURE__*/_react.default.createElement(_phone.default, Object.assign({
  LEGACY_fallbackIcon: _dialOut.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PhoneIcon.Name = 'PhoneIconMigration';
var _default = exports.default = PhoneIcon;