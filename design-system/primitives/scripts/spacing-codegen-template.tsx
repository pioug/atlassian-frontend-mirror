import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { spacing as tokens } from '@atlaskit/tokens/tokens-raw';

import { capitalize, tokenToStyle } from './utils';

const spacingProperties = {
  padding: {
    cssProperties: [
      'padding',
      'paddingBlock',
      'paddingBlockStart',
      'paddingBlockEnd',
      'paddingInline',
      'paddingInlineStart',
      'paddingInlineEnd',
    ],
  },
  gap: {
    cssProperties: ['gap'],
  },
  space: {
    cssProperties: ['gap'],
  },
  columnGap: {
    cssProperties: ['columnGap'],
  },
  rowGap: {
    cssProperties: ['rowGap'],
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

  const { cssProperties } = spacingProperties[spacingProperty];

  return (
    prettier.format(
      `
const ${spacingProperty}Map = Object.fromEntries(
  [
    '${cssProperties.join("','")}',
  ].map((property: string) => [
    property,
    {
  ${activeTokens
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    .map(token => {
      const propName =
        spacingProperty === 'space'
          ? token.name.replace(spacingTokenPrefix, '')
          : token.name;
      return `'${propName}': ${tokenToStyle(
        '[property]' as any,
        token.name,
        token.fallback,
      )}`;
    })}
  } as const,
]));`,
      {
        singleQuote: true,
        trailingComma: 'all',
        parser: 'typescript',
        plugins: [parserTypeScript],
      },
    ) +
    (cssProperties.length === 1
      ? `\nexport type ${capitalize(
          spacingProperty,
        )} = keyof typeof ${spacingProperty}Map.${cssProperties[0]};\n`
      : cssProperties
          .map(
            cssProperty =>
              `\nexport type ${capitalize(
                cssProperty,
              )} = keyof typeof ${spacingProperty}Map.${cssProperty};`,
          )
          .join('') + '\n')
  );
};
