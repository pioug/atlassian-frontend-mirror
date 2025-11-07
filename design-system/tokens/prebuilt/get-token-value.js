"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _warnOnce = _interopRequireDefault(require("@atlaskit/ds-lib/warn-once"));
var _tokenNames = _interopRequireDefault(require("./artifacts/token-names"));
/**
 * Takes a dot-separated token name and and an optional fallback, and returns the current computed CSS value for the
 * resulting CSS Custom Property.
 * This should be used for when the CSS cascade isn't available, eg. `<canvas>` elements, JS charting libraries, etc.
 *
 * Note: these values change depending on the theme so consider pairing them with `useThemeObserver` in React, or the
 * `ThemeMutationObserver` class elsewhere.
 *
 * @param {string} path - A dot-separated token name (example: `'color.background.brand'` or `'spacing.scale.100'`).
 * @param {string} [fallback] - The fallback value that should render when token CSS is not present in your app.
 *
 * @example
 * ```
 * const theme = useThemeObserver();
 *
 * useEffect(() => {
 *  const lineColor = getTokenValue('color.background.accent.blue.subtle', B400);
 * }, [theme]);
 * ```
 *
 */
function getTokenValue(tokenId) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var token = _tokenNames.default[tokenId];
  var tokenValue = fallback;
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    if (!token) {
      (0, _warnOnce.default)("Unknown token id at path: ".concat(tokenId, " in @atlaskit/tokens"));
    }
  }
  if (typeof window === 'undefined') {
    return tokenValue;
  }
  tokenValue = window.getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  tokenValue = tokenValue || fallback;
  return tokenValue;
}
var _default = exports.default = getTokenValue;