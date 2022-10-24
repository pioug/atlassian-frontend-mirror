import type { DesignToken, Format } from 'style-dictionary';

import { createSignedArtifact } from '@af/codegen';

import {
  COLOR_MODE_ATTRIBUTE,
  THEME_DATA_ATTRIBUTE,
} from '../../../src/constants';
import themeConfig, { Themes } from '../../../src/theme-config';
import { getCSSCustomProperty } from '../../../src/utils/token-ids';

export const cssVariableFormatter: Format['formatter'] = ({
  dictionary,
  options,
}) => {
  if (!options.themeName) {
    throw new Error('options.themeName required');
  }

  const theme = themeConfig[options.themeName as Themes];
  const tokens: DesignToken[] = [];

  if (!theme.id) {
    throw new Error(
      `Theme Id should include in one of the following Ids: [${Object.values(
        themeConfig,
      )
        .map(({ id }) => id)
        .join(', ')}]`,
    );
  }

  dictionary.allTokens
    .filter((token) => token.attributes && token.attributes.group !== 'palette')
    .forEach((token) => {
      const tokenName = getCSSCustomProperty(token.path);
      tokens.push({ ...token, name: tokenName });
    });

  let output = `html[${THEME_DATA_ATTRIBUTE}~="${theme.id}"] {\n`;

  tokens.forEach((token) => {
    output += `  ${token.name}: ${token.value};\n`;
  });

  output += `}\n`;

  if (theme.attributes.type === 'color') {
    output += `
@media (prefers-color-scheme: ${theme.attributes.mode}) {
  html[${COLOR_MODE_ATTRIBUTE}="auto"] {\n`;

    tokens.forEach((token) => {
      output += `    ${token.name}: ${token.value};\n`;
    });

    output += `  }\n}\n`;
  }

  return output;
};

const fileFormatter: Format['formatter'] = (args) =>
  createSignedArtifact(cssVariableFormatter(args), `yarn build tokens`);

export default fileFormatter;
