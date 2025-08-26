/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5776dc85eb34bd4bbf9313d62b1b5459>>
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
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
  name: "EmailIcon",
  LEGACY_fallbackIcon: _email2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
EmailIcon.displayName = 'EmailIconMigration';
var _default = exports.default = EmailIcon;