import prettier from 'prettier';
import type { Format } from 'style-dictionary';

import { getFullyQualifiedTokenId } from '../../../src/token-ids';

const formatter: Format['formatter'] = ({ dictionary }) => {
  const activeTokens: string[] = [];

  dictionary.allTokens
    .filter(
      (token) =>
        token.attributes?.group !== 'palette' &&
        token.attributes?.state === 'active',
    )
    .forEach((token) =>
      activeTokens.push(getFullyQualifiedTokenId(token.path)),
    );

  const activeTokenType = activeTokens
    .map((value) => ` | '${value}'`)
    .join('\n');

  return prettier.format(
    `// THIS IS AN AUTO-GENERATED FILE DO NOT MODIFY DIRECTLY
// Re-generate by running \`yarn build tokens\`.

/**
 * Internally types used for handling token ids
 */
export type InternalTokenIds = ${activeTokenType};

\n`,
    { parser: 'typescript', singleQuote: true },
  );
};

export default formatter;
