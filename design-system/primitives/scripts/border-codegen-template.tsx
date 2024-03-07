import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { shape as tokens } from '@atlaskit/tokens/tokens-raw';

import { capitalize, constructTokenFunctionCall } from './utils';

type Token = {
  token: string;
  fallback: string;
  isDeprecated: boolean;
};

const tokenStyles = {
  width: {
    objectName: 'borderWidth',
    filterPrefix: 'border.width',
    cssProperty: 'borderWidth',
    filterFn: <T extends Token>(t: T) =>
      t.token.startsWith(tokenStyles.width.filterPrefix),
  },
  radius: {
    objectName: 'borderRadius',
    filterPrefix: 'border.radius',
    cssProperty: 'borderRadius',
    filterFn: <T extends Token>(t: T) =>
      t.token.startsWith(tokenStyles.radius.filterPrefix),
  },
} as const;

const activeTokens = tokens
  .filter(t => t.attributes.state !== 'deleted')
  .map(
    (t): Token => ({
      token: t.cleanName,
      fallback: t.value === '4px' ? '3px' : (t.value as string),
      isDeprecated: t.attributes.state === 'deprecated',
    }),
  );

export const createBorderStylesFromTemplate = (
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
    .map(t => {
      return `
        ${t.isDeprecated ? '// @deprecated' : ''}
        '${t.token}': ${constructTokenFunctionCall(
        t.token,
        t.fallback,
      )}`.trim();
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
