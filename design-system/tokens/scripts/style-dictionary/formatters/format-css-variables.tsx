import type { DesignToken, Format } from 'style-dictionary';

import {
  ALLOWED_THEMES,
  DEFAULT_THEME,
  LONG_SHORT_MAPPING,
} from '../constants';

import { customPropertyValue } from './utils/custom-property';

const formatter: Format['formatter'] = ({ dictionary, options }) => {
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

  dictionary.allTokens.forEach((token) => {
    if (token.attributes && token.attributes.isPalette) {
      // Ignore palette tokens.
      return;
    }

    // We found a named token!
    const nameWithoutTheme = customPropertyValue(token.path);
    const updatedToken: DesignToken = { ...token, name: nameWithoutTheme };
    tokens.push(updatedToken);
  });

  let output = `/* THIS IS AN AUTO-GENERATED FILE DO NOT MODIFY DIRECTLY */
/* Re-generate by running \`yarn build tokens\`. */
`;

  if (themeMode === DEFAULT_THEME) {
    // Base theme
    output += `:root, html[data-theme="${themeMode}"] {\n`;
  } else {
    // Supplementary theme
    output += `html[data-theme="${themeMode}"] {\n`;
  }

  tokens.forEach((token) => {
    output += `  --${token.name}: ${token.value};\n`;
  });

  output += `}\n`;

  return output;
};

export default formatter;
