"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _warnOnce = _interopRequireDefault(require("@atlaskit/ds-lib/warn-once"));
var _platformFeatureFlags = require("@atlaskit/platform-feature-flags");
var _tokenNames = _interopRequireDefault(require("./artifacts/token-names"));
var _constants = require("./constants");
/**
 * Takes a dot-separated token name and an optional fallback, and returns the CSS custom property for the corresponding token.
 * This should be used to implement design decisions throughout your application.
 *
 * Note: With `@atlaskit/babel-plugin-tokens`, this function can be pre-compiled and a fallback value automatically inserted.
 *
 * @param {string} path - A dot-separated token name (example: `'color.background.brand'` or `'spacing.scale.100'`).
 * @param {string} [fallback] - The fallback value that should render when token CSS is not present in your app.
 *
 * @example
 * ```
 * <div
 *   css={{
 *     backgroundColor: token('elevation.surface.raised', N0),
 *     boxShadow: token('elevation.shadow.raised', `0 20px 32px -8px ${N50A}, 0 0 1px ${N60A}`),
 *     padding: token('spacing.scale.100', '8px'),
 *     fontWeight: token('font.weight.regular', '400'),
 *   }}
 * />
 * ```
 *
 */
function token(path, fallback) {
  var token = _tokenNames.default[path];
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    if (!token) {
      (0, _warnOnce.default)("Unknown token id at path: ".concat(path, " in @atlaskit/tokens"));
    }
    if (token === '--ds-icon-subtlest' && !(0, _platformFeatureFlags.fg)('platform-component-visual-refresh')) {
      (0, _warnOnce.default)("Token \"color.icon.subtlest\" is only available when feature flag \"platform-component-visual-refresh\" is on, don't use it if the flag can't be turned on on this page");
    }
  }

  // if the token is not found - replacing it with variable name without any value, to avoid it being undefined which would result in invalid css
  if (!token) {
    token = _constants.TOKEN_NOT_FOUND_CSS_VAR;
  }
  var tokenCall = fallback ? "var(".concat(token, ", ").concat(fallback, ")") : "var(".concat(token, ")");
  return tokenCall;
}
var _default = exports.default = token;