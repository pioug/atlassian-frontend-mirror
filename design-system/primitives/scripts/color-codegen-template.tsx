import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import legacyTokens from '@atlaskit/tokens/src/artifacts/tokens-raw/atlassian-legacy-light';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import tokens from '@atlaskit/tokens/src/artifacts/tokens-raw/atlassian-light';

import {
  capitalize,
  constructTokenFunctionCall,
  ShadowDefinition,
} from './utils';

type Token = {
  token: string;
  fallback: string | ShadowDefinition;
  isDeprecated: boolean;
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
  .filter(([t]) => t.attributes.state !== 'deleted')
  .map(t => t)
  .map(
    ([t, legacy]): Token => ({
      token: t.name,
      fallback: legacy.value as string | ShadowDefinition,
      isDeprecated: t.attributes.state === 'deprecated',
    }),
  );

export const createColorStylesFromTemplate = (
  colorProperty: keyof typeof tokenStyles,
) => {
  if (!tokenStyles[colorProperty]) {
    throw new Error(`[codegen] Unknown option found "${colorProperty}"`);
  }

  const { prefix, filterFn, objectName } = tokenStyles[colorProperty];

  return (
    prettier.format(
      `
export const ${objectName}Map = {
  ${activeTokens
    .filter(filterFn)
    // @ts-ignore
    .map(t => ({ ...t, token: t.token.replaceAll('.[default]', '') }))
    .map(t => {
      // handle the default case eg color.border or color.text
      const propName = t.token.replace(prefix, '');
      return `
        ${t.isDeprecated ? '// @deprecated' : ''}
        '${propName}': ${constructTokenFunctionCall(t.token, t.fallback)}
      `.trim();
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
