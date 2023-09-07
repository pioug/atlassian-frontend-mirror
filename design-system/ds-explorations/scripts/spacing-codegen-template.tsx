import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { spacing as tokens } from '@atlaskit/tokens/tokens-raw';

import { capitalize, tokenToStyle } from './utils';

const spacingProperties = {
  padding: {
    cssProperty: 'padding',
  },
  paddingBlock: {
    cssProperty: 'paddingBlock',
  },
  paddingInline: {
    cssProperty: 'paddingInline',
  },
  gap: {
    cssProperty: 'gap',
  },
  columnGap: {
    cssProperty: 'columnGap',
  },
  rowGap: {
    cssProperty: 'rowGap',
  },
} as const;

const onlySpaceTokens = tokens
  .filter((token) => token.name.startsWith('space.'))
  .filter((token) => !token.name.includes('.negative'));

const activeTokens = onlySpaceTokens.map((t) => ({
  name: t.cleanName,
  fallback: t.value,
}));

export const createSpacingStylesFromTemplate = (
  spacingProperty: keyof typeof spacingProperties,
) => {
  if (!spacingProperties[spacingProperty]) {
    throw new Error(`[codegen] Unknown option found "${spacingProperty}"`);
  }

  const { cssProperty } = spacingProperties[spacingProperty];

  return (
    prettier.format(
      `
const ${spacingProperty}Map = {
  ${activeTokens
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .map((token) => {
      const propName = token.name;
      return `'${propName}': ${tokenToStyle(
        cssProperty,
        token.name,
        token.fallback,
      )}`;
    })
    .join(',\n\t')}
};`,
      {
        singleQuote: true,
        trailingComma: 'all',
        parser: 'typescript',
        plugins: [parserTypeScript],
      },
    ) +
    `\nexport type ${capitalize(
      spacingProperty,
    )} = keyof typeof ${spacingProperty}Map;\n`
  );
};
