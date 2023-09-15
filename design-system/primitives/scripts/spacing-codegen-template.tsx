import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

import { spacing as tokens } from '@atlaskit/tokens/tokens-raw';

import { constructTokenFunctionCall } from './utils';

const spacingTokenPrefix = 'space.';
const negativeSuffix = '.negative';
const spaceTokens = tokens
  .filter(token => token.name.startsWith(spacingTokenPrefix))
  .filter(token => !token.name.includes(negativeSuffix))
  .map(t => ({
    name: t.cleanName, // Need to use cleanName to avoid getting '[default]' in the token names
    fallback: t.value,
  }));

const negativeSpaceTokens = tokens
  .filter(token => token.name.startsWith(spacingTokenPrefix))
  .filter(token => token.name.includes(negativeSuffix))
  .map(t => ({
    name: t.cleanName,
    fallback: t.value,
  }));

export const createSpacingStylesFromTemplate = () => {
  const output = [
    `export const spaceMap = {\n${spaceTokens
      .map(
        ({ name, fallback }) =>
          `'${name}': ${constructTokenFunctionCall(name, fallback)},`,
      )
      .join('\n')}}`,
    `export type Space = keyof typeof spaceMap;\n`,
    `export const negativeSpaceMap = {\n${negativeSpaceTokens
      .map(
        ({ name, fallback }) =>
          `'${name}': ${constructTokenFunctionCall(name, fallback)},`,
      )
      .join('\n')}}`,
    `export type NegativeSpace = keyof typeof negativeSpaceMap;\n`,
  ].join('\n');

  return prettier.format(output, {
    singleQuote: true,
    trailingComma: 'all',
    parser: 'typescript',
    plugins: [parserTypeScript],
  });
};
