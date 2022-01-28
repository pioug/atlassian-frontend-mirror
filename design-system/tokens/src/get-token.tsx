import warnOnce from '@atlaskit/ds-lib/warn-once';

import tokens, { CSSTokenMap } from './artifacts/token-names';

const name = process.env._PACKAGE_NAME_ as string;
const version = process.env._PACKAGE_VERSION_ as string;

type Tokens = typeof tokens;

function token<T extends keyof Tokens>(
  path: T,
  fallback?: string,
): CSSTokenMap[T] {
  let token: Tokens[keyof Tokens] = tokens[path];

  if (process.env.NODE_ENV !== 'production' && !token) {
    warnOnce(`Unknown token id at path: ${path} for ${name}@${version}`);

    token = tokens['utility.UNSAFE_util.MISSING_TOKEN'];
  }

  const tokenCall = fallback ? `var(${token}, ${fallback})` : `var(${token})`;

  return tokenCall as CSSTokenMap[T];
}

export default token;
