/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::99f4d4e8456c94c22a17bc4074cc60fe>>
 * @codegenCommand yarn build:icon-glyphs
 */
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
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for LogInIcon.
 * This component is LogInIcon, with `UNSAFE_fallbackIcon` set to "SignInIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
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