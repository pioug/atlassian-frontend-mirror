import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { typographyAdg3 as tokens } from '@atlaskit/tokens/tokens-raw';

import { capitalize, constructTokenFunctionCall } from './utils';

type Token = {
  name: string;
  fallback: string;
};

const activeTokens: Token[] = tokens
  .filter(t => t.attributes.state === 'active')
  .map(t => ({
    name: t.name,
    fallback: t.value,
  }));

const typographyProperties = [
  {
    objectName: 'fontSize',
    cssProperty: 'font',
    prefix: 'font.body',
    filterFn: <T extends Token>(t: T) => t.name.startsWith('font.body'),
  },
  {
    objectName: 'fontWeight',
    cssProperty: 'fontWeight',
    prefix: 'font.weight.',
    filterFn: <T extends Token>(t: T) => t.name.startsWith('font.weight'),
  },
  {
    objectName: 'fontFamily',
    cssProperty: 'fontFamily',
    prefix: 'font.family.',
    filterFn: <T extends Token>(t: T) => t.name.startsWith('font.family'),
  },
] as const;

const bodySizeMap = {
  'body.small': 'small',
  'body.UNSAFE_small': 'UNSAFE_small',
  body: 'medium',
  'body.large': 'large',
};

const removeVerbosity = (name: string): string => {
  const partialRemove = ['font.body'];
  if (partialRemove.some(s => name.includes(s))) {
    // @ts-expect-error Indexing bodySizeMap
    return bodySizeMap[name.replace('font.', '')];
  }

  const fullRemove = ['font.weight'];
  const removeIndex = fullRemove.findIndex(s => name.includes(s));
  if (removeIndex > -1) {
    return name.replace(`${fullRemove[removeIndex]}.`, '');
  }

  return name;
};

export const createTypographyStylesFromTemplate = () => {
  return typographyProperties
    .map(typographyProperty => {
      const { filterFn, objectName } = typographyProperty;

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
        `\nexport type ${capitalize(
          objectName,
        )} = keyof typeof ${objectName}Map;\n`
      );
    })
    .join('\n');
};
