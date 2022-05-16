import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@af/codegen';

const formatter: Format['formatter'] = ({ dictionary, options }) => {
  const tokens = options?.groups
    ? dictionary.allTokens.filter(
        (token) =>
          token.attributes && options.groups.includes(token.attributes.group),
      )
    : dictionary.allTokens;

  const output = `const tokens = ${JSON.stringify(tokens, null, 2)};

export default tokens;\n`;

  return createSignedArtifact(output, `yarn build tokens`);
};

export default formatter;
