import memoizeOne from 'memoize-one';

import * as colors from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { codeFontFamily } from '@atlaskit/theme/constants';
import type { Theme } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import type { CodeBlockTheme, CodeTheme } from './types';

// Hardcoded values have been used due to the current color palette not having any
// accessible color options for Teal and Yellow and +20A
const T800 = '#067384';
const Y1100 = '#7A5D1A';
const PLUS20 = '#3A434E';

export const getBaseTheme = (theme: Theme): CodeTheme => ({
  fontFamily: codeFontFamily(),
  fontFamilyItalic: `SFMono-MediumItalic, ${codeFontFamily()}`,
  backgroundColor: themed({
    light: token('color.background.neutral', colors.N20),
    dark: token('color.background.neutral', colors.DN50),
  })({ theme }),
  textColor: themed({
    light: token('color.text', colors.N800),
    dark: token('color.text', colors.DN800),
  })({ theme }),
  lineNumberColor: themed({
    light: token('color.text.subtlest', colors.N400),
    dark: token('color.text.subtlest', colors.DN400),
  })({ theme }),
  lineNumberBgColor: themed({
    light: token('color.background.neutral', colors.N30),
    dark: token('color.background.neutral', colors.DN20),
  })({ theme }),
});

export const defaultBaseTheme = getBaseTheme({ mode: 'light' });

export const getColorPalette = memoizeOne((theme: Theme): CodeBlockTheme => {
  const akTheme = { theme };
  return {
    highlightedLineBgColor: themed({
      light: token('color.background.neutral', colors.N30),
      dark: token('color.background.neutral', PLUS20),
    })(akTheme),
    highlightedLineBorderColor: themed({
      light: token('color.border.focused', colors.B200),
      dark: token('color.border.focused', colors.B100),
    })(akTheme),
    substringColor: themed({
      light: token('color.text.subtlest', colors.N400),
      dark: token('color.text.subtlest', colors.DN400),
    })(akTheme),
    keywordColor: themed({
      light: token('color.text.accent.blue', colors.B400),
      dark: token('color.text.accent.blue', colors.B75),
    })(akTheme),
    attributeColor: themed({
      light: token('color.text.accent.teal', T800),
      dark: token('color.text.accent.teal', colors.T200),
    })(akTheme),
    selectorTagColor: themed({
      light: token('color.text.accent.blue', colors.B400),
      dark: token('color.text.accent.blue', colors.B75),
    })(akTheme),
    docTagColor: themed({
      light: token('color.text.accent.yellow', Y1100),
      dark: token('color.text.accent.yellow', colors.Y300),
    })(akTheme),
    nameColor: themed({
      light: token('color.text.accent.blue', colors.B400),
      dark: token('color.text.accent.blue', colors.B75),
    })(akTheme),
    builtInColor: themed({
      light: token('color.text.accent.blue', colors.B400),
      dark: token('color.text.accent.blue', colors.B75),
    })(akTheme),
    literalColor: themed({
      light: token('color.text.accent.blue', colors.B400),
      dark: token('color.text.accent.blue', colors.B75),
    })(akTheme),
    bulletColor: themed({
      light: token('color.text.accent.blue', colors.B400),
      dark: token('color.text.accent.blue', colors.B75),
    })(akTheme),
    codeColor: themed({
      light: token('color.text.accent.blue', colors.B400),
      dark: token('color.text.accent.blue', colors.B75),
    })(akTheme),
    regexpColor: themed({
      light: token('color.text.accent.teal', T800),
      dark: token('color.text.accent.teal', colors.T200),
    })(akTheme),
    symbolColor: themed({
      light: token('color.text.accent.teal', T800),
      dark: token('color.text.accent.teal', colors.T200),
    })(akTheme),
    variableColor: themed({
      light: token('color.text.accent.teal', T800),
      dark: token('color.text.accent.teal', colors.T200),
    })(akTheme),
    templateVariableColor: themed({
      light: token('color.text.accent.teal', T800),
      dark: token('color.text.accent.teal', colors.T200),
    })(akTheme),
    linkColor: themed({
      light: token('color.text.accent.purple', colors.P300),
      dark: token('color.text.accent.purple', colors.P75),
    })(akTheme),
    selectorAttributeColor: themed({
      light: token('color.text.accent.teal', T800),
      dark: token('color.text.accent.teal', colors.T200),
    })(akTheme),
    selectorPseudoColor: themed({
      light: token('color.text.accent.teal', T800),
      dark: token('color.text.accent.teal', colors.T200),
    })(akTheme),
    typeColor: themed({
      light: token('color.text.accent.teal', T800),
      dark: token('color.text.accent.teal', colors.T100),
    })(akTheme),
    stringColor: themed({
      light: token('color.text.accent.green', colors.G500),
      dark: token('color.text.accent.green', colors.G200),
    })(akTheme),
    selectorIdColor: themed({
      light: token('color.text.accent.teal', T800),
      dark: token('color.text.accent.teal', colors.T100),
    })(akTheme),
    selectorClassColor: themed({
      light: token('color.text.accent.teal', T800),
      dark: token('color.text.accent.teal', colors.T100),
    })(akTheme),
    quoteColor: themed({
      light: token('color.text.accent.teal', T800),
      dark: token('color.text.accent.teal', colors.T100),
    })(akTheme),
    templateTagColor: themed({
      light: token('color.text.accent.teal', T800),
      dark: token('color.text.accent.teal', colors.T100),
    })(akTheme),
    titleColor: themed({
      light: token('color.text.accent.purple', colors.P300),
      dark: token('color.text.accent.purple', colors.P75),
    })(akTheme),
    sectionColor: themed({
      light: token('color.text.accent.purple', colors.P300),
      dark: token('color.text.accent.purple', colors.P75),
    })(akTheme),
    commentColor: themed({
      light: token('color.text.subtlest', colors.N400),
      dark: token('color.text.subtlest', colors.DN400),
    })(akTheme),
    metaKeywordColor: themed({
      light: token('color.text.accent.green', colors.G500),
      dark: token('color.text.accent.green', colors.G200),
    })(akTheme),
    metaColor: themed({
      light: token('color.text.subtlest', colors.N400),
      dark: token('color.text.subtlest', colors.DN400),
    })(akTheme),
    functionColor: themed({
      light: token('color.text', colors.N800),
      dark: token('color.text', colors.DN800),
    })(akTheme),
    numberColor: themed({
      light: token('color.text.accent.blue', colors.B400),
      dark: token('color.text.accent.blue', colors.B75),
    })(akTheme),
    prologColor: themed({
      light: token('color.text.accent.blue', colors.B400),
      dark: token('color.text.accent.blue', colors.B75),
    })(akTheme),
    cdataColor: themed({
      light: token('color.text.subtlest', colors.N400),
      dark: token('color.text.subtlest', colors.B75),
    })(akTheme),
    punctuationColor: themed({
      light: token('color.text', colors.N800),
      dark: token('color.text', colors.DN800),
    })(akTheme),
    propertyColor: themed({
      light: token('color.text.accent.purple', colors.P300),
      dark: token('color.text.accent.purple', colors.P75),
    })(akTheme),
    constantColor: themed({
      light: token('color.text.accent.teal', T800),
      dark: token('color.text.accent.teal', colors.T100),
    })(akTheme),
    booleanColor: themed({
      light: token('color.text.accent.blue', colors.B400),
      dark: token('color.text.accent.blue', colors.B75),
    })(akTheme),
    charColor: themed({
      light: token('color.text', colors.N800),
      dark: token('color.text', colors.DN800),
    })(akTheme),
    insertedColor: themed({
      light: token('color.text.accent.green', colors.G500),
      dark: token('color.text.accent.green', colors.B75),
    })(akTheme),
    deletedColor: themed({
      light: token('color.text.accent.red', colors.R500),
      dark: token('color.text.accent.red', colors.B75),
    })(akTheme),
    operatorColor: themed({
      light: token('color.text', colors.N800),
      dark: token('color.text', colors.B75),
    })(akTheme),
    atruleColor: themed({
      light: token('color.text.accent.green', colors.G500),
      dark: token('color.text.accent.green', colors.G200),
    })(akTheme),
    importantColor: themed({
      light: token('color.text.accent.yellow', Y1100),
      dark: token('color.text.accent.yellow', colors.Y300),
    })(akTheme),
  };
});

const getTheme = (theme: Theme): CodeBlockTheme => ({
  ...getBaseTheme(theme),
  ...getColorPalette(theme),
});

export default getTheme;
