import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import tokens from '@atlaskit/tokens/src/artifacts/tokens-raw/atlassian-spacing';

import { capitalize, tokenToStyle } from './utils';

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
  columnGap: {
    cssProperty: 'columnGap',
  },
  rowGap: {
    cssProperty: 'rowGap',
  },
} as const;

type Token = {
  name: string;
  fallback: string;
};

const onlyScaleTokens = tokens.filter((token) =>
  token.name.startsWith('spacing.scale.'),
);

const activeTokens = onlyScaleTokens.map(
  (t): Token => ({
    name: t.name,
    fallback: t.value,
  }),
);

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
      const propName = token.name.replace('spacing.', '');
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
