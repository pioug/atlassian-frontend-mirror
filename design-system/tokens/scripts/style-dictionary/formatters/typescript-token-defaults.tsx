import prettier from 'prettier';
import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen';

import { getTokenId } from '../../../src/utils/token-ids';
import sortTokens from '../sort-tokens';

const formatter: Format['formatter'] = ({ dictionary }) => {
  const tokens: Record<string, string> = {};

  sortTokens(
    dictionary.allTokens.filter(
      (token) => token.attributes?.group !== 'palette',
    ),
  ).forEach((token) => {
    const tokenName = getTokenId(token.path);
    tokens[tokenName] = token.value;
  });

  const tokensDefaultKeyValues = Object.keys(tokens)
    .map((name) => `  '${name}': '${tokens[name]}',`)
    .join('\n');

  const source = prettier.format(
    `const defaultTokenValues = {
  ${tokensDefaultKeyValues}
  } as const;

  export default defaultTokenValues;\n`,
    { parser: 'typescript', singleQuote: true },
  );

  return createSignedArtifact(
    source,
    `yarn build tokens`,
    `DEPRECATED, PLEASE DO NOT USE.
    Default values can now be based on either light or legacy-light themes, whereas this only contains light theme values.

    Token names mapped to their value in the default Atlassian themes ('light').
    These default values are used by the Babel plugin to optionally provide automatic fallbacks.`,
  );
};

export default formatter;
