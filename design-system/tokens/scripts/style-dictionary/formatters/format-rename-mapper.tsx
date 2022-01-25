import type { Format } from 'style-dictionary';

const formatter: Format['formatter'] = ({ dictionary }) => {
  const tokens = dictionary.allTokens
    .filter(
      (token) =>
        token.attributes &&
        token.attributes.group !== 'palette' &&
        token.attributes.replacement,
    )
    .map((token) => ({
      path: token.path.join('.'),
      state: token.attributes?.state,
      replacement: token.attributes?.replacement,
    }));

  return `
// THIS IS AN AUTO-GENERATED FILE DO NOT MODIFY DIRECTLY

/**
 * This file is intended to help automate renaming of tokens.
 *
 * 1. Mark the old token's 'state' as deprecated
 * 2. Add a 'rename' attribute to the token with the value 'my.new.token'
 * 3. Create a new token matching the token above: 'my.new.token'
 * 4. Run 'bolt build tokens' to have you changes reflected in this map
 * 5. eslint and other tools will now use this to automate replacing tokens
 *
 * These changes will then be picked up by our tooling, which will attempt to
 * migrate as many of these renames as possible
 */

import tokens from './token-names';

type Token = keyof typeof tokens | string;
type RenameMap = {
  path: string;
  state: 'deprecated' | 'deleted';
  replacement: Token;
}

const renameMapper: RenameMap[] = ${JSON.stringify(tokens, null, 2)};

export default renameMapper;
`;
};

export default formatter;
