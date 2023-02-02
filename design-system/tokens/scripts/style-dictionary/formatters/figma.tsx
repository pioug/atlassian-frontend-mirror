import upperFirst from 'lodash/upperFirst';
import type { Format } from 'style-dictionary';

import themeConfig, { Themes } from '../../../src/theme-config';
import { getTokenId } from '../../../src/utils/token-ids';
import sortTokens from '../sort-tokens';

const formatTokenPath = (path: string[], themeName: string) =>
  `${themeName}/${getTokenId(path)}`;

export const figmaFormatter: Format['formatter'] = ({
  dictionary,
  options,
}) => {
  if (!options.themeName) {
    throw new Error('options.themeName required');
  }

  const themeName = upperFirst(
    themeConfig[options.themeName as Themes].id,
  ).replace('-', ' ');

  const tokens = sortTokens(
    dictionary.allTokens.filter(
      (token) =>
        token.attributes &&
        (token.attributes.group === 'paint' ||
          token.attributes.group === 'shadow' ||
          token.attributes.group === 'spacing' ||
          token.attributes.group === 'lineHeight' ||
          token.attributes.group === 'fontFamily' ||
          token.attributes.group === 'fontWeight') &&
        token.attributes.state !== 'deprecated' &&
        token.attributes.state !== 'deleted',
    ),
  ).reduce<Record<string, any>>((accum, token) => {
    accum[formatTokenPath(token.path, themeName)] = {
      ...token.original,
      value: token.value,
    };
    return accum;
  }, {});

  const renameMap = dictionary.allTokens
    .filter((token) => Boolean(token.attributes?.replacement))
    .reduce<Record<string, string>>((accum, token) => {
      accum[formatTokenPath(token.path, themeName)] = formatTokenPath(
        (Array.isArray(token.attributes?.replacement)
          ? token.attributes?.replacement[0]
          : token.attributes?.replacement
        ).split('.'),
        themeName,
      );
      return accum;
    }, {});

  return JSON.stringify({ name: themeName, tokens, renameMap }, null, 2);
};

const fileFormatter: Format['formatter'] = (args) => figmaFormatter(args);

export default fileFormatter;
