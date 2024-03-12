import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import {
  legacyLightTokens as legacyTokens,
  light as tokens,
} from '@atlaskit/tokens/tokens-raw';

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
      t.token.startsWith(tokenStyles.text.prefix) ||
      t.token.startsWith('color.link'),
  },
  background: {
    objectName: 'backgroundColor',
    prefix: 'color.background.',
    cssProperty: 'backgroundColor',
    filterFn: <T extends Token>(t: T) =>
      t.token.startsWith(tokenStyles.background.prefix) ||
      t.token.startsWith('elevation.surface') ||
      t.token.startsWith('utility.elevation.surface') ||
      t.token.startsWith('color.blanket'),
  },
  border: {
    objectName: 'borderColor',
    prefix: 'color.border.',
    cssProperty: 'borderColor',
    filterFn: <T extends Token>(t: T) =>
      t.token.startsWith(tokenStyles.border.prefix),
  },
  fill: {
    objectName: 'fill',
    prefix: 'color.icon.',
    cssProperty: 'fill',
    filterFn: <T extends Token>(t: T) =>
      t.token.startsWith(tokenStyles.fill.prefix),
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

  const { filterFn, objectName } = tokenStyles[colorProperty];

  return (
    prettier.format(
      `
export const ${objectName}Map = {
  ${activeTokens
    .filter(filterFn)
    // @ts-ignore
    .map(t => ({ ...t, token: t.token.replaceAll('.[default]', '') }))
    .map(t => {
      return `
        ${t.isDeprecated ? '// @deprecated' : ''}
        '${t.token}': ${constructTokenFunctionCall(t.token, t.fallback)}
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
