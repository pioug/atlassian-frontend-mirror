import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import tokens from '@atlaskit/tokens/src/artifacts/tokens-raw/atlassian-spacing';

const onlyScaleTokens = tokens.filter((token) =>
  token.name.startsWith('spacing.scale.'),
);

type Token = {
  name: string;
};

const activeTokens = onlyScaleTokens.map(
  (t): Token => ({
    name: t.name,
  }),
);

export const createSpacingScaleTemplate = () => {
  return prettier.format(
    `
export const spacingScale = [
  ${activeTokens
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .map((token) => {
      const propName = token.name.replace('spacing.', '');
      return `'${propName}'`;
    })
    .join(',\n\t')}
] as const;`,
    {
      singleQuote: true,
      parser: 'typescript',
      trailingComma: 'all',
      plugins: [parserTypeScript],
    },
  );
};
