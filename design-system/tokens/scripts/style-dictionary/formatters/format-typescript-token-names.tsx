import prettier from 'prettier';
import type { Format } from 'style-dictionary';

import { getCSSCustomProperty, getTokenId } from '../../../src/token-ids';

const formatter: Format['formatter'] = ({ dictionary }) => {
  const tokens: Record<string, string> = {};

  dictionary.allTokens
    .filter((token) => token.attributes?.group !== 'palette')
    .forEach((token) => {
      const tokenName = getTokenId(token.path);
      tokens[tokenName] = getCSSCustomProperty(token.path);
    });

  const tokensKeyValues = Object.keys(tokens)
    .map((name) => `  '${name}': '${tokens[name]}',`)
    .join('\n');

  const tokenReturnKeyValues = Object.keys(tokens)
    .map((name) => `  '${name}': 'var(${tokens[name]})',`)
    .join('\n');

  return prettier.format(
    `// THIS IS AN AUTO-GENERATED FILE DO NOT MODIFY DIRECTLY
// Re-generate by running \`yarn build tokens\`.
const tokens = {
${tokensKeyValues}
} as const;

export type CSSTokenMap = {
${tokenReturnKeyValues}
};

export type CSSToken = CSSTokenMap[keyof CSSTokenMap];

export default tokens;\n`,
    { parser: 'typescript', singleQuote: true },
  );
};

export default formatter;
