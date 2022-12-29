import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { spacing as tokens } from '@atlaskit/tokens/tokens-raw';

const onlyScaleTokens = tokens.filter((token) =>
  token.name.startsWith('spacing.scale.'),
);

const activeTokens = onlyScaleTokens.map(
  (t) => `'${t.name.replace('spacing.', '')}'`,
);

export const createSpacingScaleTemplate = () => {
  return prettier.format(
    `
export const spacingScale = [
  ${activeTokens
    .sort((a, b) => {
      const spaceValueA = Number(a.match(/(\d+)/)![0]);
      const spaceValueB = Number(b.match(/(\d+)/)![0]);
      return spaceValueA < spaceValueB ? -1 : 1;
    })
    .join(',\n\t')}
] as const;`,
    {
      singleQuote: true,
      parser: 'typescript',
      trailingComma: 'all',
      plugins: [parserTypeScript],
    },
  );
};
