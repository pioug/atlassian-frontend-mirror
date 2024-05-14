import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen';

import sortTokens from '../sort-tokens';

const formatter: Format['formatter'] = ({ dictionary }) => {
  const tokens = sortTokens(
    dictionary.allTokens.filter(
      (token) =>
        token.attributes &&
        (token.attributes.state === 'experimental' ||
          token.attributes.state === 'deprecated' ||
          token.attributes.state === 'deleted'),
    ),
  ).map((token) => ({
    path: token.path.join('.'),
    state: token.attributes?.state,
    replacement: token.attributes?.replacement,
  }));

  const source = `import type tokens from './token-names';

type Token = keyof typeof tokens | string;
type RenameMap = {
  path: string;
  state: 'experimental' | 'deprecated' | 'deleted';
  replacement?: Token;
}

const replacementMapper: RenameMap[] = ${JSON.stringify(tokens, null, 2)};

export default replacementMapper;\n`;

  return createSignedArtifact(
    source,
    'yarn build tokens',
    `This file is intended to help automate renaming of tokens.

1. Mark the old token's 'state' as deprecated
2. Add a 'replacement' attribute to the token with the value 'my.new.token'
3. Create a new token matching the token above: 'my.new.token'
4. Run 'yarn build tokens' to have you changes reflected in this map
5. ESLint and other tools will now use this to automate replacing tokens

These changes will then be picked up by our tooling which will attempt to
migrate as many of these renames as possible.`,
  );
};

export default formatter;
