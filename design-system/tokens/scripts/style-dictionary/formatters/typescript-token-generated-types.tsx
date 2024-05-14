import type { Format } from 'style-dictionary';

import format from '@af/formatting/sync';
import { createSignedArtifact } from '@atlassian/codegen';

import { getTokenId } from '../../../src/utils/token-ids';
import sortTokens from '../sort-tokens';

const formatter: Format['formatter'] = ({ dictionary }) => {
  const activeTokens: string[] = [];

  sortTokens(
    dictionary.allTokens.filter(
      (token) =>
        token.attributes?.group !== 'palette' &&
        token.attributes?.state === 'active',
    ),
  ).forEach((token) => activeTokens.push(getTokenId(token.path)));

  if (activeTokens.length) {
    const activeTokenType = activeTokens
      .map((value) => ` | '${value}'`)
      .join('\n');

    return format(`export type ActiveTokens = ${activeTokenType};\n`, 'typescript');
  }

  return `// No active tokens in this theme\nexport {}`;
};

const fileFormatter: Format['formatter'] = (args) =>
  createSignedArtifact(formatter(args), `yarn build tokens`);

export default fileFormatter;
