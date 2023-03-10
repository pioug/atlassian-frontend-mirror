import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { spacing as tokens } from '@atlaskit/tokens/tokens-raw';

import { capitalize, tokenCall, tokenToStyle } from './utils';

const spacingProperties: Record<
  string,
  {
    cssProperties: readonly string[];
    responsiveOutput?: boolean;
  }
> = {
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
    responsiveOutput: true,
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

  const { cssProperties, responsiveOutput } =
    spacingProperties[spacingProperty]!;

  return (
    prettier.format(
      `
const ${spacingProperty}Map = {
  ${activeTokens
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    .map(token => {
      const propName =
        spacingProperty === 'space'
          ? token.name.replace(spacingTokenPrefix, '')
          : token.name;

      // a responsive output simply prints out a mapping of tokens
      if (responsiveOutput) {
        return `'${token.name}': ${tokenCall(token.name, token.fallback)}`;
      }

      return `'${propName}': ${tokenToStyle(
        [cssProperties] as any,
        token.name,
        token.fallback,
      )}`;
    })}
  } as const;`,
      {
        singleQuote: true,
        trailingComma: 'all',
        parser: 'typescript',
        plugins: [parserTypeScript],
      },
    ) +
    (cssProperties
      .map(
        cssProperty =>
          `\nexport type ${capitalize(
            cssProperties.length === 1 ? spacingProperty : cssProperty,
          )} = keyof typeof ${spacingProperty}Map;`,
      )
      .join('') +
      '\n')
  );
};
