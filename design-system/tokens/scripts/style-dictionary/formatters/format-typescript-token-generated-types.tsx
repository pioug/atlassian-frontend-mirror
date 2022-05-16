import prettier from 'prettier';
import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@af/codegen';

import { getTokenId } from '../../../src/utils/token-ids';

const formatter: Format['formatter'] = ({ dictionary }) => {
  const activeTokens: string[] = [];

  dictionary.allTokens
    .filter(
      (token) =>
        token.attributes?.group !== 'palette' &&
        token.attributes?.state === 'active',
    )
    .forEach((token) => activeTokens.push(getTokenId(token.path)));

  const activeTokenType = activeTokens
    .map((value) => ` | '${value}'`)
    .join('\n');

  const source = prettier.format(
    `export type ActiveTokens = ${activeTokenType};\n`,
    { parser: 'typescript', singleQuote: true },
  );

  return createSignedArtifact(source, `yarn build tokens`);
};

export default formatter;
