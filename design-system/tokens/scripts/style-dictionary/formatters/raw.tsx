import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@af/codegen';

const formatter: Format['formatter'] = ({ dictionary }) => {
  const output = `const tokens = ${JSON.stringify(
    dictionary.allTokens,
    null,
    2,
  )};

export default tokens;\n`;

  return createSignedArtifact(output, `yarn build tokens`);
};

export default formatter;
