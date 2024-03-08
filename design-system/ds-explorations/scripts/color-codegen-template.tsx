import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import legacyTokens from '@atlaskit/tokens/src/artifacts/tokens-raw/atlassian-legacy-light';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import tokens from '@atlaskit/tokens/src/artifacts/tokens-raw/atlassian-light';

import {
  capitalize,
  compose,
  isAccent,
  isHovered,
  isPressed,
  not,
  pick,
  ShadowDefintion,
  tokenToStyle,
} from './utils';

type Token = {
  token: string;
  fallback: string | ShadowDefintion;
};

// NB: Fallback CSS variables can be deleted when tokens are no longer behind a feature flag
const tokenStyles = {
  text: {
    objectName: 'textColor',
    prefix: 'color.text.',
    cssProperty: 'color',
    filterFn: <T extends Token>(t: T) =>
      t.token.startsWith(tokenStyles.text.prefix),
  },
  background: {
    objectName: 'backgroundColor',
    prefix: 'color.background.',
    cssProperty: 'backgroundColor',
    filterFn: <T extends Token>(t: T) =>
      t.token.startsWith(tokenStyles.background.prefix) ||
      t.token.startsWith('elevation.surface') ||
      t.token.startsWith('color.blanket'),
  },
  border: {
    objectName: 'borderColor',
    prefix: 'color.border.',
    cssProperty: 'borderColor',
    filterFn: <T extends Token>(t: T) =>
      t.token.startsWith(tokenStyles.border.prefix),
  },
  shadow: {
    objectName: 'shadow',
    prefix: 'elevation.shadow.',
    cssProperty: 'boxShadow',
    filterFn: <T extends Token>(t: T) =>
      t.token.startsWith(tokenStyles.shadow.prefix),
  },
} as const;

const bothTokens = tokens.map((t, i) => [t, legacyTokens[i]]);

const activeTokens = bothTokens
  .filter(
    ([t]) =>
      t.attributes.state !== 'deleted' && t.attributes.state !== 'deprecated',
  )
  .map(
    ([t, legacy]): Token => ({
      token: t.name,
      fallback: legacy.value as string | ShadowDefintion,
    }),
  )
  .filter(compose(pick('token'), not(isAccent)))
  .filter(compose(pick('token'), not(isPressed)))
  .filter(compose(pick('token'), not(isHovered)));

export const createColorStylesFromTemplate = (
  colorProperty: keyof typeof tokenStyles,
) => {
  if (!tokenStyles[colorProperty]) {
    throw new Error(`[codegen] Unknown option found "${colorProperty}"`);
  }

  const { prefix, cssProperty, filterFn, objectName } =
    tokenStyles[colorProperty];

  return (
    prettier.format(
      `
const ${objectName}Map = {
  ${activeTokens
    .filter(filterFn)
    // @ts-ignore
    .map((t) => ({ ...t, token: t.token.replaceAll('.[default]', '') }))
    .map((t) => {
      // handle the default case eg color.border or color.text
      const propName = t.token.replace(prefix, '');
      return `'${propName}': ${tokenToStyle(cssProperty, t.token, t.fallback)}`;
    })
    .join(',\n\t')}
} as const;`,
      {
        singleQuote: true,
        parser: 'typescript',
        trailingComma: 'all',
        plugins: [parserTypeScript],
      },
    ) +
    `\nexport type ${capitalize(objectName)} = keyof typeof ${objectName}Map;\n`
  );
};
