import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import type { Format } from 'style-dictionary';

const formatRenameMapping = (mapping: Record<string, string>, prefix: string) =>
  Object.entries(mapping).reduce<Record<string, string>>(
    (accum, [key, value]) => {
      const oldPath = `${prefix}/${key
        .split('.')
        .map((str) => upperFirst(str))
        .join('/')}`;

      accum[oldPath] = `${prefix}/${value
        .split('.')
        .map((str) => upperFirst(str))
        .join('/')}`;

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
    if (token.attributes && token.attributes.isPalette) {
      // Ignore palette tokens.
      return;
    }

    // don't add raw group tokens to Figma
    if (token.attributes?.group === 'raw') {
      return;
    }

    // We found a themed token!
    const tokenPath = token.path.map((path) => upperFirst(path)).join('/');
    const fullPath = `${themeName}/${tokenPath}`;

    tokens[fullPath] = {
      ...token.original,
      value: token.value,
    };
  });

  return `// THIS IS AN AUTO-GENERATED FILE DO NOT MODIFY DIRECTLY
// Re-generate by running \`yarn build tokens\`.
// Read the instructions to use this here:
// \`packages/design-system/tokens/src/figma/README.md\`
synchronizeFigmaTokens('${themeName}', ${JSON.stringify(
    tokens,
    null,
    2,
  )}, ${JSON.stringify(
    formatRenameMapping(options.renameMapping, themeName),
    null,
    2,
  )});
`;
};

export default formatter;
