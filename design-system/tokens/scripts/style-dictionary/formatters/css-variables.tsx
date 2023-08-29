import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen';

import {
  COLOR_MODE_ATTRIBUTE,
  THEME_DATA_ATTRIBUTE,
} from '../../../src/constants';
import themeConfig, { Themes } from '../../../src/theme-config';
import { getCSSCustomProperty } from '../../../src/utils/token-ids';
import sortTokens from '../sort-tokens';
import { fontTokenToCSS } from '../transformers/web-font';
import { getValue } from '../utilities';

export const cssVariableFormatter: Format['formatter'] = ({
  dictionary,
  options,
}) => {
  if (!options.themeName) {
    throw new Error('options.themeName required');
  }

  const theme = themeConfig[options.themeName as Themes];
  const colorModes = ['light', 'dark'] as const;

  if (!theme.id) {
    throw new Error(
      `Theme Id should include in one of the following Ids: [${Object.values(
        themeConfig,
      )
        .map(({ id }) => id)
        .join(', ')}]`,
    );
  }

  const fontFamilyTokens = dictionary.allTokens.filter(
    (token) => token.attributes?.group === 'fontFamily',
  );

  const tokens = sortTokens(
    dictionary.allTokens.filter(
      (token) => token.attributes && token.attributes.group !== 'palette',
    ),
  ).map((token) => {
    const tokenName = getCSSCustomProperty(token.path);

    if (token.attributes?.group === 'typography') {
      const ffToken = fontFamilyTokens.find(
        (t) => token.original.value.fontFamily === t.original.value,
      );
      token.value.fontFamily = `var(${getCSSCustomProperty(ffToken!.path)})`;
      token.value = fontTokenToCSS(token);
    }

    return { ...token, name: tokenName };
  });

  let output = '';
  const themeId = theme.override || theme.id;

  if (theme.attributes.type === 'color') {
    const selectors = colorModes.map(
      (mode) =>
        `html[${COLOR_MODE_ATTRIBUTE}="${mode}"][${THEME_DATA_ATTRIBUTE}~="${mode}:${themeId}"]`,
    );
    output += `${selectors.join(',\n')} {\n`;
    output += `  color-scheme: ${theme.attributes.mode};\n`;
  } else {
    output += `html[${THEME_DATA_ATTRIBUTE}~="${theme.attributes.type}:${themeId}"] {\n`;
  }

  tokens.forEach((token) => {
    const tokenValue = getValue(dictionary, token);

    output += `  ${token.name}: ${tokenValue};\n`;
  });

  output += `}\n`;

  return output;
};

const fileFormatter: Format['formatter'] = (args) =>
  createSignedArtifact(cssVariableFormatter(args), `yarn build tokens`);

export default fileFormatter;
