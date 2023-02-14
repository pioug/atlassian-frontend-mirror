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
  paddingBlockStart: {
    cssProperty: 'paddingBlockStart',
  },
  paddingBlockEnd: {
    cssProperty: 'paddingBlockEnd',
  },
  paddingInline: {
    cssProperty: 'paddingInline',
  },
  paddingInlineStart: {
    cssProperty: 'paddingInlineStart',
  },
  paddingInlineEnd: {
    cssProperty: 'paddingInlineEnd',
  },
  gap: {
    cssProperty: 'gap',
  },
  space: {
    cssProperty: 'gap',
  },
  columnGap: {
    cssProperty: 'columnGap',
  },
  rowGap: {
    cssProperty: 'rowGap',
  },
} as const;

const spacingTokenPrefix = 'space.';
const onlySpaceTokens = tokens.filter(token =>
  token.name.startsWith(spacingTokenPrefix),
);

const activeTokens = onlySpaceTokens.map(t => ({
  name: t.name,
  fallback: t.attributes.pixelValue!,
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
    .map(token => {
      const propName =
        spacingProperty === 'space'
          ? token.name.replace(spacingTokenPrefix, '')
          : token.name;
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
