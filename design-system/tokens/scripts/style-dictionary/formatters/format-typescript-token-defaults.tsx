import prettier from 'prettier';
import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@af/codegen';

import { DEFAULT_THEME } from '../../../src/constants';
import { getTokenId } from '../../../src/utils/token-ids';

const formatter: Format['formatter'] = ({ dictionary }) => {
  const tokens: Record<string, string> = {};

  dictionary.allTokens
    .filter((token) => token.attributes?.group !== 'palette')
    .forEach((token) => {
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
    `Token names mapped to their value in the default Atlassian theme ('${DEFAULT_THEME}')`,
  );
};

export default formatter;
