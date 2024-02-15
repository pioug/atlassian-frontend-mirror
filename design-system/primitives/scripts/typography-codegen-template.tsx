import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { typographyAdg3 as tokens } from '@atlaskit/tokens/tokens-raw';

import { capitalize, constructTokenFunctionCall } from './utils';

type Token = {
  name: string;
  fallback: string;
};

const typographyProperties = {
  heading: {
    objectName: 'headingText',
    prefix: 'font.heading',
    cssProperty: 'font',
    filterFn: <T extends Token>(t: T) => t.name.startsWith('font.heading'),
  },
  body: {
    objectName: 'bodyText',
    prefix: 'font.body',
    cssProperty: 'font',
    filterFn: <T extends Token>(t: T) => t.name.startsWith('font.body'),
  },
  ui: {
    objectName: 'uiText',
    prefix: 'font.ui',
    cssProperty: 'font',
    filterFn: <T extends Token>(t: T) => t.name.startsWith('font.ui'),
  },
  fontSize: {
    objectName: 'fontSize',
    cssProperty: 'fontSize',
    prefix: 'font.size',
    filterFn: <T extends Token>(t: T) => t.name.startsWith('font.size'),
  },
  fontWeight: {
    objectName: 'fontWeight',
    cssProperty: 'fontWeight',
    prefix: 'font.weight.',
    filterFn: <T extends Token>(t: T) => t.name.startsWith('font.weight'),
  },
  fontFamily: {
    objectName: 'fontFamily',
    cssProperty: 'fontFamily',
    prefix: 'font.family.',
    filterFn: <T extends Token>(t: T) => t.name.startsWith('font.family'),
  },
  lineHeight: {
    objectName: 'lineHeight',
    cssProperty: 'lineHeight',
    prefix: 'font.',
    filterFn: <T extends Token>(t: T) => t.name.startsWith('font.lineHeight'),
  },
} as const;

const activeTokens: Token[] = tokens.map(t => ({
  name: t.name,
  fallback: t.value,
}));

const removeVerbosity = (name: string): string => {
  const partialRemove = ['font.heading', 'font.ui', 'font.body'];
  if (partialRemove.some(s => name.includes(s))) {
    return name.replace('font.', '');
  }

  const fullRemove = ['font.weight'];
  const removeIndex = fullRemove.findIndex(s => name.includes(s));
  if (removeIndex > -1) {
    return name.replace(`${fullRemove[removeIndex]}.`, '');
  }

  return name;
};

export const createTypographyStylesFromTemplate = (
  typographyProperty: keyof typeof typographyProperties,
) => {
  if (!typographyProperties[typographyProperty]) {
    throw new Error(`[codegen] Unknown option found "${typographyProperty}"`);
  }

  const { filterFn, objectName } = typographyProperties[typographyProperty];

  return (
    prettier.format(
      `
export const ${objectName}Map = {
${activeTokens
  .filter(filterFn)
  .map(t => ({ ...t, name: t.name.replace(/\.\[default\]/g, '') }))
  .sort((a, b) => (a.name < b.name ? -1 : 1))
  .map(token => {
    return `
      '${removeVerbosity(token.name)}': ${constructTokenFunctionCall(
      token.name,
      token.fallback,
    )}
    `.trim();
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
    `\nexport type ${capitalize(objectName)} = keyof typeof ${objectName}Map;\n`
  );
};
