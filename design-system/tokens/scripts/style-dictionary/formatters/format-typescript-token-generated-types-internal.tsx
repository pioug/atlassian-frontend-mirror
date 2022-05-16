import prettier from 'prettier';
import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@af/codegen';

import { getFullyQualifiedTokenId } from '../../../src/utils/token-ids';

export const typescriptFormatter: Format['formatter'] = ({ dictionary }) => {
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
    `export type InternalTokenIds = ${activeTokenType};\n`,
    { parser: 'typescript', singleQuote: true },
  );
};

const fileFormatter: Format['formatter'] = (args) =>
  createSignedArtifact(typescriptFormatter(args), `yarn build tokens`);

export default fileFormatter;
