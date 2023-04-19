import warnOnce from '@atlaskit/ds-lib/warn-once';

import tokens, { CSSTokenMap } from './artifacts/token-names';
import { TOKEN_NOT_FOUND_CSS_VAR } from './constants';

const name = process.env._PACKAGE_NAME_ as string;
const version = process.env._PACKAGE_VERSION_ as string;

type Tokens = typeof tokens;

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
function token<T extends keyof Tokens>(
  path: T,
  fallback?: string,
): CSSTokenMap[T] {
  let token: Tokens[keyof Tokens] | typeof TOKEN_NOT_FOUND_CSS_VAR =
    tokens[path];

  if (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV !== 'production' &&
    !token
  ) {
    warnOnce(`Unknown token id at path: ${path} for ${name}@${version}`);
  }

  // if the token is not found - replacing it with variable name without any value, to avoid it being undefined which would result in invalid css
  if (!token) {
    token = TOKEN_NOT_FOUND_CSS_VAR;
  }

  const tokenCall = fallback ? `var(${token}, ${fallback})` : `var(${token})`;

  return tokenCall as CSSTokenMap[T];
}

export default token;
