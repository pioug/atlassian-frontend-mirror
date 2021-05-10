import memoizeOne from 'memoize-one';

import * as colors from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { codeFontFamily } from '@atlaskit/theme/constants';
import type { Theme } from '@atlaskit/theme/types';

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
    light: colors.N20,
    dark: colors.DN50,
  })({ theme }),
  textColor: themed({ light: colors.N800, dark: colors.DN800 })({ theme }),
  lineNumberColor: themed({ light: colors.N400, dark: colors.DN400 })({
    theme,
  }),
  lineNumberBgColor: themed({
    light: colors.N30,
    dark: colors.DN20,
  })({
    theme,
  }),
});

export const defaultBaseTheme = getBaseTheme({ mode: 'light' });

export const getColorPalette = memoizeOne(
  (theme: Theme): CodeBlockTheme => {
    const akTheme = { theme };
    return {
      highlightedLineBgColor: themed({
        light: colors.N30,
        dark: PLUS20,
      })(akTheme),
      highlightedLineBorderColor: themed({
        light: colors.B200,
        dark: colors.B100,
      })(akTheme),
      substringColor: themed({ light: colors.N400, dark: colors.DN400 })(
        akTheme,
      ),
      keywordColor: themed({ light: colors.B400, dark: colors.B75 })(akTheme),
      attributeColor: themed({ light: T800, dark: colors.T200 })(akTheme),
      selectorTagColor: themed({ light: colors.B400, dark: colors.B75 })(
        akTheme,
      ),
      docTagColor: themed({ light: Y1100, dark: colors.Y300 })(akTheme),
      nameColor: themed({ light: colors.B400, dark: colors.B75 })(akTheme),
      builtInColor: themed({ light: colors.B400, dark: colors.B75 })(akTheme),
      literalColor: themed({ light: colors.B400, dark: colors.B75 })(akTheme),
      bulletColor: themed({ light: colors.B400, dark: colors.B75 })(akTheme),
      codeColor: themed({ light: colors.B400, dark: colors.B75 })(akTheme),
      regexpColor: themed({ light: T800, dark: colors.T200 })(akTheme),
      symbolColor: themed({ light: T800, dark: colors.T200 })(akTheme),
      variableColor: themed({ light: T800, dark: colors.T200 })(akTheme),
      templateVariableColor: themed({ light: T800, dark: colors.T200 })(
        akTheme,
      ),
      linkColor: themed({ light: colors.P300, dark: colors.P75 })(akTheme),
      selectorAttributeColor: themed({ light: T800, dark: colors.T200 })(
        akTheme,
      ),
      selectorPseudoColor: themed({ light: T800, dark: colors.T200 })(akTheme),
      typeColor: themed({ light: T800, dark: colors.T100 })(akTheme),
      stringColor: themed({ light: colors.G500, dark: colors.G200 })(akTheme),
      selectorIdColor: themed({ light: T800, dark: colors.T100 })(akTheme),
      selectorClassColor: themed({ light: T800, dark: colors.T100 })(akTheme),
      quoteColor: themed({ light: T800, dark: colors.T100 })(akTheme),
      templateTagColor: themed({ light: T800, dark: colors.T100 })(akTheme),
      titleColor: themed({ light: colors.P300, dark: colors.P75 })(akTheme),
      sectionColor: themed({ light: colors.P300, dark: colors.P75 })(akTheme),
      commentColor: themed({ light: colors.N400, dark: colors.DN400 })(akTheme),
      metaKeywordColor: themed({ light: colors.G500, dark: colors.G200 })(
        akTheme,
      ),
      metaColor: themed({ light: colors.N400, dark: colors.DN400 })(akTheme),
      functionColor: themed({ light: colors.N800, dark: colors.DN800 })(
        akTheme,
      ),
      numberColor: themed({ light: colors.B400, dark: colors.B75 })(akTheme),
      prologColor: themed({ light: colors.B400, dark: colors.B75 })(akTheme),
      cdataColor: themed({ light: colors.N400, dark: colors.B75 })(akTheme),
      punctuationColor: themed({ light: colors.N800, dark: colors.DN800 })(
        akTheme,
      ),
      propertyColor: themed({ light: colors.P300, dark: colors.P75 })(akTheme),
      constantColor: themed({ light: T800, dark: colors.T100 })(akTheme),
      booleanColor: themed({ light: colors.B500, dark: colors.B75 })(akTheme),
      charColor: themed({ light: colors.N800, dark: colors.DN800 })(akTheme),
      insertedColor: themed({ light: colors.G500, dark: colors.B75 })(akTheme),
      deletedColor: themed({ light: colors.R500, dark: colors.B75 })(akTheme),
      operatorColor: themed({ light: colors.N800, dark: colors.B75 })(akTheme),
      atruleColor: themed({ light: colors.G500, dark: colors.G200 })(akTheme),
      importantColor: themed({ light: Y1100, dark: colors.Y300 })(akTheme),
    };
  },
);

const getTheme = (theme: Theme): CodeBlockTheme => ({
  ...getBaseTheme(theme),
  ...getColorPalette(theme),
});

export default getTheme;
