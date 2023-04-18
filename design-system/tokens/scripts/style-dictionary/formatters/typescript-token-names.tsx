import prettier from 'prettier';
import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen';

import { getCSSCustomProperty, getTokenId } from '../../../src/utils/token-ids';
import sortTokens from '../sort-tokens';

export const typescriptTokenFormatter: Format['formatter'] = ({
  dictionary,
}) => {
  const tokens: Record<string, string> = {};

  sortTokens(
    dictionary.allTokens.filter(
      (token) =>
        token.attributes?.group !== 'palette' &&
        token.attributes?.group !== 'scale',
    ),
  ).forEach((token) => {
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
    `const tokens = {
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

const fileFormatter: Format['formatter'] = (args) =>
  createSignedArtifact(typescriptTokenFormatter(args), `yarn build tokens`);

export default fileFormatter;
