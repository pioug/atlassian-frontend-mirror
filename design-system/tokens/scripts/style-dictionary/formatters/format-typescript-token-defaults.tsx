import prettier from 'prettier';
import type { Format } from 'style-dictionary';

import { DEFAULT_THEME } from '../constants';

const formatter: Format['formatter'] = ({ dictionary }) => {
  const tokens: Record<string, string> = {};

  dictionary.allTokens.forEach((token) => {
    if (token.attributes && token.attributes.isPalette) {
      // Ignore palette tokens.
      return;
    }

    // Generate token key/value pairs
    const tokenName = token.path.join('.');
    tokens[tokenName] = token.value;
  });

  const tokensDefaultKeyValues = Object.keys(tokens)
    .map((name) => `  '${name}': '${tokens[name]}',`)
    .join('\n');

  return prettier.format(
    `// THIS IS AN AUTO-GENERATED FILE DO NOT MODIFY DIRECTLY
// Re-generate by running \`yarn build tokens\`.

/**
 * A map of token names to their value in the default Atlassian theme ('${DEFAULT_THEME}')
*/
const defaultTokenValues = {
${tokensDefaultKeyValues}
} as const;

export default defaultTokenValues;\n`,
    { parser: 'typescript', singleQuote: true },
  );
};

export default formatter;
