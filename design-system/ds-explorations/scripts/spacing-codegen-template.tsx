import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import tokens from '@atlaskit/tokens/spacing-raw';

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

const onlyScaleTokens = tokens.filter((token) =>
  token.name.startsWith('space.'),
);

const activeTokens = onlyScaleTokens.map((t) => ({
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
    .map((token) => {
      // TODO change this when we want to cut a major on the package
      const propName = token.name.replace('space.', 'scale.');
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
