import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { typographyAdg3 as tokens } from '@atlaskit/tokens/tokens-raw';

import { capitalize, tokenToStyle } from './utils';

type Token = {
  name: string;
  fallback: string;
};

const typographyProperties = {
  fontSize: {
    cssProperty: 'fontSize',
    prefix: 'font.',
    filterFn: <T extends Token>(t: T) => t.name.startsWith('font.size'),
  },
  fontWeight: {
    cssProperty: 'fontWeight',
    prefix: 'font.weight.',
    filterFn: <T extends Token>(t: T) => t.name.startsWith('font.weight'),
  },
  fontFamily: {
    cssProperty: 'fontFamily',
    prefix: 'font.family.',
    filterFn: <T extends Token>(t: T) => t.name.startsWith('font.family'),
  },
  lineHeight: {
    cssProperty: 'lineHeight',
    prefix: 'font.',
    filterFn: <T extends Token>(t: T) => t.name.startsWith('font.lineHeight'),
  },
} as const;

const activeTokens: Token[] = tokens.map((t) => ({
  name: t.name,
  fallback: t.value,
}));

export const createTypographyStylesFromTemplate = (
  typographyProperty: keyof typeof typographyProperties,
) => {
  if (!typographyProperties[typographyProperty]) {
    throw new Error(`[codegen] Unknown option found "${typographyProperty}"`);
  }

  const { cssProperty, prefix, filterFn } =
    typographyProperties[typographyProperty];

  return (
    prettier.format(
      `
const ${typographyProperty}Map = {
  ${activeTokens
    .filter(filterFn)
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .map((token) => {
      const propName = token.name.replace(prefix, '');

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
      typographyProperty,
    )} = keyof typeof ${typographyProperty}Map;\n`
  );
};
