import type { DesignToken, Format } from 'style-dictionary';

import { createSignedArtifact } from '@af/codegen';

import { ALLOWED_THEMES, LONG_SHORT_MAPPING } from '../../../src/constants';
import { getCSSCustomProperty } from '../../../src/utils/token-ids';

export const cssVariableFormatter: Format['formatter'] = ({
  dictionary,
  options,
}) => {
  if (!options.themeName) {
    throw new Error('options.themeName required');
  }

  const themeMode = LONG_SHORT_MAPPING[options.themeName];
  const tokens: DesignToken[] = [];

  if (!ALLOWED_THEMES.includes(themeMode)) {
    throw new Error(
      `Theme name should end in one of [${ALLOWED_THEMES.join(', ')}]`,
    );
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
