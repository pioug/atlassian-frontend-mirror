import type { DesignToken, Format } from 'style-dictionary';

import { createSignedArtifact } from '@af/codegen';

import {
  COLOR_MODE_ATTRIBUTE,
  THEME_DATA_ATTRIBUTE,
} from '../../../src/constants';
import themeConfig, {
  themeOverrideConfig,
  ThemeOverrides,
  Themes,
} from '../../../src/theme-config';
import { getCSSCustomProperty } from '../../../src/utils/token-ids';
import sortTokens from '../sort-tokens';

export const cssVariableFormatter: Format['formatter'] = ({
  dictionary,
  options,
}) => {
  if (!options.themeName) {
    throw new Error('options.themeName required');
  }

  const theme =
    themeOverrideConfig[options.themeName as ThemeOverrides] ||
    themeConfig[options.themeName as Themes];
  const tokens: DesignToken[] = [];
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

  sortTokens(
    dictionary.allTokens.filter(
      (token) => token.attributes && token.attributes.group !== 'palette',
    ),
  ).forEach((token) => {
    const tokenName = getCSSCustomProperty(token.path);
    tokens.push({ ...token, name: tokenName });
  });

  let output = '';
  const themeId = theme.overrideTheme || theme.id;

  if (theme.attributes.type === 'color') {
    const selectors = colorModes.map(
      (mode) =>
        `html[${COLOR_MODE_ATTRIBUTE}="${mode}"][${THEME_DATA_ATTRIBUTE}~="${mode}:${themeId}"]`,
    );
    output += `${selectors.join(',\n')} {\n`;
  } else {
    output += `html[${THEME_DATA_ATTRIBUTE}~="${theme.attributes.type}:${themeId}"] {\n`;
  }

  tokens.forEach((token) => {
    output += `  ${token.name}: ${token.value};\n`;
  });

  output += `}\n`;

  return output;
};

const fileFormatter: Format['formatter'] = (args) =>
  createSignedArtifact(cssVariableFormatter(args), `yarn build tokens`);

export default fileFormatter;
