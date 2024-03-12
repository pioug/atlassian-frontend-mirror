import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { CURRENT_SURFACE_CSS_VAR } from '@atlaskit/tokens';
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
  opacity: {
    objectName: 'opacity',
    prefix: 'opacity.',
    cssProperty: 'opacity',
    filterFn: <T extends Token>(t: T) =>
      t.token.startsWith(tokenStyles.opacity.prefix),
  },
  shadow: {
    objectName: 'shadow',
    prefix: 'elevation.shadow.',
    cssProperty: 'boxShadow',
    filterFn: <T extends Token>(t: T) =>
      t.token.startsWith(tokenStyles.shadow.prefix),
  },
  surface: {
    objectName: 'surfaceColor',
    prefix: 'elevation.surface.',
    cssProperty: CURRENT_SURFACE_CSS_VAR,
    filterFn: <T extends Token>(t: T) =>
      t.token.startsWith(tokenStyles.surface.prefix),
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

export const createElevationStylesFromTemplate = (
  property: keyof typeof tokenStyles,
) => {
  if (!tokenStyles[property]) {
    throw new Error(`[codegen] Unknown option found "${property}"`);
  }

  const { filterFn, objectName } = tokenStyles[property];

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
