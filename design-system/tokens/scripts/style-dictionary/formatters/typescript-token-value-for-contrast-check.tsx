import prettier from 'prettier';
import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen';

import { additionalChecks } from '../../../src/utils/custom-theme-token-contrast-check';
import { getTokenId } from '../../../src/utils/token-ids';

export const formatter: Format['formatter'] = ({ dictionary }) => {
  const tokens: Record<string, string> = {};
  const theme = dictionary.allProperties[0].filePath.includes('light')
    ? 'light'
    : 'dark';
  additionalChecks.forEach((pair) => {
    if (!(pair.foreground in tokens)) {
      tokens[pair.foreground] = '';
    }
    if (theme === 'light' && !(pair.backgroundLight in tokens)) {
      tokens[pair.backgroundLight] = '';
    }
    if (theme === 'dark' && !(pair.backgroundDark in tokens)) {
      tokens[pair.backgroundDark] = '';
    }
  });

  dictionary.allTokens.forEach((token) => {
    const tokenName = getTokenId(token.path);
    if (tokenName in tokens) {
      tokens[tokenName] = token.value;
    }
  });

  const tokensKeyValues = Object.keys(tokens)
    .map((name) => `  '${name}': '${tokens[name]}',`)
    .join('\n');

  const source = prettier.format(
    `const tokenValues = {
      ${tokensKeyValues}
    } as const;

    export default tokenValues;\n`,
    { parser: 'typescript', singleQuote: true },
  );

  return createSignedArtifact(
    source,
    `yarn build tokens`,
    'Token names mapped to their values, used for contrast checking when generating custom themes',
  );
};

export default formatter;
