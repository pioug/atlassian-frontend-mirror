"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _email = _interopRequireDefault(require("@atlaskit/icon/core/email"));
var _email2 = _interopRequireDefault(require("@atlaskit/icon/glyph/email"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for EmailIcon.
 * This component is EmailIcon, with `UNSAFE_fallbackIcon` set to "EmailIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for when an email-related things.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const EmailIcon = props => /*#__PURE__*/_react.default.createElement(_email.default, Object.assign({
  LEGACY_fallbackIcon: _email2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
EmailIcon.Name = 'EmailIconMigration';
var _default = exports.default = EmailIcon;