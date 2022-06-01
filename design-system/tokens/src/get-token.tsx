import warnOnce from '@atlaskit/ds-lib/warn-once';

import tokens, { CSSTokenMap } from './artifacts/token-names';
import { TOKEN_NOT_FOUND_CSS_VAR } from './constants';

const name = process.env._PACKAGE_NAME_ as string;
const version = process.env._PACKAGE_VERSION_ as string;

type Tokens = typeof tokens;

function token<T extends keyof Tokens>(
  path: T,
  fallback?: string,
): CSSTokenMap[T] {
  let token: Tokens[keyof Tokens] | typeof TOKEN_NOT_FOUND_CSS_VAR =
    tokens[path];

  if (process.env.NODE_ENV !== 'production' && !token) {
    token = tokens['utility.UNSAFE_util.MISSING_TOKEN'];
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
