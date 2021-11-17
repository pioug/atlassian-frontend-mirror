import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import type { Format } from 'style-dictionary';

const formatTokenPath = (path: string) =>
  path
    .split('.')
    .map(upperFirst)
    .join('/')
    .replace('/Hover', ' Hover')
    .replace('/Resting', ' Resting')
    .replace('/Pressed', ' Pressed');

const formatRenameMapping = (mapping: Record<string, string>) =>
  Object.entries(mapping).reduce<Record<string, string>>(
    (accum, [key, value]) => {
      const oldPath = formatTokenPath(key);
      const newPath = formatTokenPath(value);
      accum[oldPath] = newPath;
      return accum;
    },
    {},
  );

const formatter: Format['formatter'] = ({ dictionary, options }) => {
  if (!options.themeName) {
    throw new Error('options.themeName required');
  }

  const tokens: Record<string, any> = {};
  const themeName = upperFirst(camelCase(options.themeName));

  dictionary.allTokens.forEach((token) => {
    if (token.attributes && token.attributes.group === 'palette') {
      // Ignore palette tokens.
      return;
    }

    // don't add raw group tokens to Figma
    if (token.attributes?.group === 'raw') {
      return;
    }

    // We found a themed token!
    const tokenPath = token.path.map((path) => upperFirst(path)).join('/');
    // In figma, we want interaction states to be grouped together
    // under the appearance
    const formattedTokenPath = formatTokenPath(tokenPath);

    tokens[formattedTokenPath] = {
      ...token.original,
      value: token.value,
    };
  });

  const renameMap = dictionary.allTokens
    .filter((token) => token.attributes && !!token.attributes.replacement)
    .reduce<Record<string, string>>((accum, token) => {
      accum[token.path.join('.')] = token.attributes?.replacement;
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
  )}, ${JSON.stringify(formatRenameMapping(renameMap), null, 2)});
`;
};

export default formatter;
