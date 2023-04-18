import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen';

import { getTokenId } from '../../../src/utils/token-ids';
import sortTokens from '../sort-tokens';

const formatter: Format['formatter'] = ({ dictionary, options }) => {
  const output = `const tokens = ${JSON.stringify(
    sortTokens(dictionary.allTokens).map((token) => ({
      ...token,
      ...(options.cleanName === true
        ? { cleanName: getTokenId(token.path) }
        : []),
    })),
    null,
    2,
  )};

export default tokens;\n`;

  return createSignedArtifact(output, `yarn build tokens`);
};

export default formatter;
