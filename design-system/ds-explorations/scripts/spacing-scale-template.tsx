import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { spacing as tokens } from '@atlaskit/tokens/tokens-raw';

const onlySpaceTokens = tokens
  .filter((token) => token.name.startsWith('space.'))
  .filter((token) => !token.name.includes('.negative'));

const activeTokens = onlySpaceTokens.map((t) => `'${t.cleanName}'`);

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
