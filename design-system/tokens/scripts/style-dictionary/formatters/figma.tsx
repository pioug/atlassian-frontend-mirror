import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@af/codegen';

const formatTokenPath = (path: string[]) =>
  path
    .map(upperFirst)
    .join('/')
    .replace(/\[default\]/g, 'Default');

export const figmaFormatter: Format['formatter'] = ({
  dictionary,
  options,
}) => {
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
    .filter((token) => Boolean(token.attributes?.replacement))
    .reduce<Record<string, string>>((accum, token) => {
      accum[formatTokenPath(token.path)] = formatTokenPath(
        (Array.isArray(token.attributes?.replacement)
          ? token.attributes?.replacement[0]
          : token.attributes?.replacement
        ).split('.'),
      );
      return accum;
    }, {});

  return `// eslint-disable-next-line no-undef
synchronizeFigmaTokens('${themeName}', ${JSON.stringify(
    tokens,
    null,
    2,
  )}, ${JSON.stringify(renameMap, null, 2)});\n`;
};

const fileFormatter: Format['formatter'] = (args) =>
  createSignedArtifact(
    figmaFormatter(args),
    `yarn build tokens`,
    'Read instructions for running here {@see packages/design-system/tokens/src/figma/README.md}',
  );

export default fileFormatter;
