import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { spacing as tokens } from '@atlaskit/tokens/tokens-raw';

import { capitalize, constructTokenFunctionCall } from './utils';

const spacingProperties: Record<
  string,
  {
    cssProperties: readonly string[];
    propNameFormatter?: (propName: string) => string;
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
  },
  space: {
    cssProperties: ['gap', 'rowGap'],
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

  const { cssProperties, propNameFormatter } =
    spacingProperties[spacingProperty]!;

  return (
    prettier.format(
      `
  export const ${spacingProperty}Map = {
    ${activeTokens
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true }),
      )
      .map(token => {
        const propName = propNameFormatter
          ? propNameFormatter(token.name)
          : token.name;
        return `'${propName}': ${constructTokenFunctionCall(
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
            cssProperty,
          )} = keyof typeof ${spacingProperty}Map;`,
      )
      .join('') +
      '\n')
  );
};
