import type { DesignToken, Format } from 'style-dictionary';

import { createSignedArtifact } from '@af/codegen';

import { THEME_NAME_MAP, THEMES } from '../../../src/constants';
import { Themes } from '../../../src/types';
import { getCSSCustomProperty } from '../../../src/utils/token-ids';

export const cssVariableFormatter: Format['formatter'] = ({
  dictionary,
  options,
}) => {
  if (!options.themeName) {
    throw new Error('options.themeName required');
  }

  const themeMode = THEME_NAME_MAP[
    options.themeName as keyof typeof THEME_NAME_MAP
  ] as Themes;
  const tokens: DesignToken[] = [];

  if (!THEMES.includes(themeMode)) {
    throw new Error(`Theme name should end in one of [${THEMES.join(', ')}]`);
  }

  dictionary.allTokens
    .filter((token) => token.attributes && token.attributes.group !== 'palette')
    .forEach((token) => {
      const tokenName = getCSSCustomProperty(token.path);
      tokens.push({ ...token, name: tokenName });
    });

  let output = `html[data-theme="${themeMode}"] {\n`;

  tokens.forEach((token) => {
    output += `  ${token.name}: ${token.value};\n`;
  });

  output += `}\n`;

  return output;
};

const fileFormatter: Format['formatter'] = (args) =>
  createSignedArtifact(cssVariableFormatter(args), `yarn build tokens`);

export default fileFormatter;
