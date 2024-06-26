"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _logOut = _interopRequireDefault(require("@atlaskit/icon/core/log-out"));
var _signOut = _interopRequireDefault(require("@atlaskit/icon/glyph/sign-out"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for LogOutIcon.
 * This component is LogOutIcon, with `UNSAFE_fallbackIcon` set to "SignOutIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for logout.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LogOutIcon = props => /*#__PURE__*/_react.default.createElement(_logOut.default, Object.assign({
  LEGACY_fallbackIcon: _signOut.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LogOutIcon.Name = 'LogOutIconMigration';
var _default = exports.default = LogOutIcon;