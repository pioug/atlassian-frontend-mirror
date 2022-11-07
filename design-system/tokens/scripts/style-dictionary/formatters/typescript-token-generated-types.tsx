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

  if (activeTokens.length) {
    const activeTokenType = activeTokens
      .map((value) => ` | '${value}'`)
      .join('\n');

    return prettier.format(`export type ActiveTokens = ${activeTokenType};\n`, {
      parser: 'typescript',
      singleQuote: true,
    });
  }

  return `// No active tokens in this theme\nexport {}`;
};

const fileFormatter: Format['formatter'] = (args) =>
  createSignedArtifact(formatter(args), `yarn build tokens`);

export default fileFormatter;
