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
      'paddingBlockEnd',
      'paddingBlockStart',
      'paddingBottom',
      'paddingInline',
      'paddingInlineEnd',
      'paddingInlineStart',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
    ],
  },
  space: {
    cssProperties: ['gap', 'rowGap', 'columnGap'],
  },
  inset: {
    cssProperties: [
      'inset',
      'insetBlock',
      'insetBlockEnd',
      'insetBlockStart',
      'insetInline',
      'insetInlineEnd',
      'insetInlineStart',
    ],
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

  return prettier.format(
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
    } as const;` +
      (cssProperties
        .map(
          cssProperty =>
            // TODO: Update to use `keyof` when ERT supports it: https://github.com/atlassian/extract-react-types/issues/149
            `\nexport type ${capitalize(cssProperty)} = ${activeTokens
              .map(token => `'${token.name}'`)
              .join(' | ')}`,
        )
        .join('') +
        '\n'),
    {
      singleQuote: true,
      trailingComma: 'all',
      parser: 'typescript',
      plugins: [parserTypeScript],
    },
  );
};
