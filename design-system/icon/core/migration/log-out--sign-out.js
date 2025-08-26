/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a30eb510b1221e5a753c026b36f8f8d9>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _logOut = _interopRequireDefault(require("@atlaskit/icon/core/log-out"));
var _signOut = _interopRequireDefault(require("@atlaskit/icon/glyph/sign-out"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for LogOutIcon.
 * This component is LogOutIcon, with `UNSAFE_fallbackIcon` set to "SignOutIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for log out.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LogOutIcon = props => /*#__PURE__*/_react.default.createElement(_logOut.default, Object.assign({
  name: "LogOutIcon",
  LEGACY_fallbackIcon: _signOut.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LogOutIcon.displayName = 'LogOutIconMigration';
var _default = exports.default = LogOutIcon;