import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import type { Format } from 'style-dictionary';

const formatTokenPath = (path: string[]) =>
  path
    .map(upperFirst)
    .join('/')
    .replace(/\[default\]/g, 'Default');

const formatter: Format['formatter'] = ({ dictionary, options }) => {
  if (!options.themeName) {
    throw new Error('options.themeName required');
  }

  const themeName = upperFirst(camelCase(options.themeName));

  const tokens = dictionary.allTokens
    .filter(
      (token) =>
        token.attributes &&
        token.attributes.group !== 'palette' &&
        token.attributes.group !== 'raw' &&
        token.attributes.state !== 'deprecated' &&
        token.attributes.state !== 'deleted',
    )
    .reduce<Record<string, any>>((accum, token) => {
      accum[formatTokenPath(token.path)] = {
        ...token.original,
        value: token.value,
      };
      return accum;
    }, {});

  const renameMap = dictionary.allTokens
    .filter((token) => !!token.attributes?.replacement)
    .reduce<Record<string, string>>((accum, token) => {
      accum[formatTokenPath(token.path)] = formatTokenPath(
        token.attributes?.replacement.split('.'),
      );
      return accum;
    }, {});

  return `
/* eslint-disable no-undef */

// THIS IS AN AUTO-GENERATED FILE DO NOT MODIFY DIRECTLY
// Re-generate by running \`yarn build tokens\`.
// Read the instructions to use this here:
// \`packages/design-system/tokens/src/figma/README.md\`
synchronizeFigmaTokens('${themeName}', ${JSON.stringify(
    tokens,
    null,
    2,
  )}, ${JSON.stringify(renameMap, null, 2)});
`;
};

export default formatter;
