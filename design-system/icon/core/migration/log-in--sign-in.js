"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _logIn = _interopRequireDefault(require("@atlaskit/icon/core/log-in"));
var _signIn = _interopRequireDefault(require("@atlaskit/icon/glyph/sign-in"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for LogInIcon.
 * This component is LogInIcon, with `UNSAFE_fallbackIcon` set to "SignInIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for login.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LogInIcon = props => /*#__PURE__*/_react.default.createElement(_logIn.default, Object.assign({
  LEGACY_fallbackIcon: _signIn.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LogInIcon.Name = 'LogInIconMigration';
var _default = exports.default = LogInIcon;