import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { SPACING_SCALE } from '../src/constants';

const spacingProperties = {
  width: {
    cssProperty: 'width',
  },
  height: {
    cssProperty: 'height',
  },
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
} as const;

export const createSpacingStylesFromTemplate = (
  spacingProperty: keyof typeof spacingProperties,
) => {
  if (!spacingProperties[spacingProperty]) {
    throw new Error(`[codegen] Unknown option found "${spacingProperty}"`);
  }

  const { cssProperty } = spacingProperties[spacingProperty];

  return prettier.format(
    `
const ${spacingProperty}Map = {
  ${Object.keys(SPACING_SCALE)
    .map((key) => {
      return `'${key}': css({ ${cssProperty}: SPACING_SCALE['${key}'] })`;
    })
    .join(',\n\t')}
};`,
    {
      singleQuote: true,
      trailingComma: 'all',
      parser: 'typescript',
      plugins: [parserTypeScript],
    },
  );
};
