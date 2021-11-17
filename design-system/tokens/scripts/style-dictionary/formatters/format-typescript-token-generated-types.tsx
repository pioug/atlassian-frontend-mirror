import prettier from 'prettier';
import type { Format } from 'style-dictionary';

import { customPropertyKey } from './utils/custom-property';

const formatter: Format['formatter'] = ({ dictionary }) => {
  const activeTokens: string[] = [];

  dictionary.allTokens
    .filter(
      (token) =>
        token.attributes?.group !== 'palette' &&
        token.attributes?.state === 'active',
    )
    .forEach((token) => activeTokens.push(customPropertyKey(token.path)));

  const activeTokenType = activeTokens
    .map((value) => ` | '${value}'`)
    .join('\n');

  return prettier.format(
    `// THIS IS AN AUTO-GENERATED FILE DO NOT MODIFY DIRECTLY
// Re-generate by running \`yarn build tokens\`.

/**
 * Type representing the currently active tokens
 */
export type ActiveTokens = ${activeTokenType};

\n`,
    { parser: 'typescript', singleQuote: true },
  );
};

export default formatter;
