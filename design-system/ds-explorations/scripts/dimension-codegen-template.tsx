import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { capitalize } from './utils';

const dimensionProperties = {
  width: {
    cssProperty: 'width',
  },
  height: {
    cssProperty: 'height',
  },
} as const;

// placeholder adapted from packages/design-system/avatar/src/constants.ts
const dimensions = {
  'size.100': '16px',
  'size.200': '24px',
  'size.300': '32px',
  'size.400': '40px',
  'size.500': '48px',
  'size.600': '96px',
  'size.1000': '192px',
  '100%': '100%',
} as const;

const activeTokens = Object.entries(dimensions).map(([name, value]) => ({
  name,
  value,
}));

export const createDimensionStylesFromTemplate = (
  spacingProperty: keyof typeof dimensionProperties,
) => {
  if (!dimensionProperties[spacingProperty]) {
    throw new Error(`[codegen] Unknown option found "${spacingProperty}"`);
  }

  const { cssProperty } = dimensionProperties[spacingProperty];

  return (
    prettier.format(
      `
const ${spacingProperty}Map = {
  ${activeTokens
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .map((token) => {
      return `'${token.name}': css({ ${cssProperty}: '${token.value}' })`;
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
