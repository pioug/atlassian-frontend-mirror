/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d7a2b6cdc35065dd9118d8dca0206090>>
 * @codegenCommand yarn build:icon-glyphs
 */
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
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for EmailIcon.
 * This component is EmailIcon, with `UNSAFE_fallbackIcon` set to "EmailIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for when an email-related things.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const EmailIcon = props => /*#__PURE__*/_react.default.createElement(_email.default, Object.assign({
  LEGACY_fallbackIcon: _email2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
EmailIcon.Name = 'EmailIconMigration';
var _default = exports.default = EmailIcon;