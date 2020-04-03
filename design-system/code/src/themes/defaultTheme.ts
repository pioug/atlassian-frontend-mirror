import { themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';
import memoizeOne from 'memoize-one';

import { Theme } from './themeBuilder';

export const defaultColors = memoizeOne(
  (theme: any): Theme => {
    const akTheme = { theme };
    return {
      lineNumberColor: themed({ light: colors.N90, dark: colors.DN90 })(
        akTheme,
      ),
      lineNumberBgColor: themed({ light: colors.N30, dark: colors.DN20 })(
        akTheme,
      ),
      backgroundColor: themed({ light: colors.N20, dark: colors.DN50 })(
        akTheme,
      ),
      textColor: themed({ light: colors.N800, dark: colors.DN800 })(akTheme),
      substringColor: themed({ light: colors.N400, dark: colors.DN400 })(
        akTheme,
      ),
      keywordColor: themed({ light: colors.B400, dark: colors.B100 })(akTheme),
      attributeColor: themed({ light: colors.T300, dark: colors.T200 })(
        akTheme,
      ),
      selectorTagColor: themed({ light: colors.B400, dark: colors.B100 })(
        akTheme,
      ),
      docTagColor: themed({ light: colors.Y300, dark: colors.Y300 })(akTheme),
      nameColor: themed({ light: colors.B400, dark: colors.B100 })(akTheme),
      builtInColor: themed({ light: colors.B400, dark: colors.B100 })(akTheme),
      literalColor: themed({ light: colors.B400, dark: colors.B100 })(akTheme),
      bulletColor: themed({ light: colors.B400, dark: colors.B100 })(akTheme),
      codeColor: themed({ light: colors.B400, dark: colors.B100 })(akTheme),
      additionColor: themed({ light: colors.B400, dark: colors.B100 })(akTheme),
      regexpColor: themed({ light: colors.T300, dark: colors.T200 })(akTheme),
      symbolColor: themed({ light: colors.T300, dark: colors.T200 })(akTheme),
      variableColor: themed({ light: colors.T300, dark: colors.T200 })(akTheme),
      templateVariableColor: themed({ light: colors.T300, dark: colors.T200 })(
        akTheme,
      ),
      linkColor: themed({ light: colors.P300, dark: colors.P100 })(akTheme),
      selectorAttributeColor: themed({ light: colors.T300, dark: colors.T200 })(
        akTheme,
      ),
      selectorPseudoColor: themed({ light: colors.T300, dark: colors.T200 })(
        akTheme,
      ),
      typeColor: themed({ light: colors.T500, dark: colors.T300 })(akTheme),
      stringColor: themed({ light: colors.G300, dark: colors.G300 })(akTheme),
      selectorIdColor: themed({ light: colors.T500, dark: colors.T300 })(
        akTheme,
      ),
      selectorClassColor: themed({ light: colors.T500, dark: colors.T300 })(
        akTheme,
      ),
      quoteColor: themed({ light: colors.T500, dark: colors.T300 })(akTheme),
      templateTagColor: themed({ light: colors.T500, dark: colors.T300 })(
        akTheme,
      ),
      deletionColor: themed({ light: colors.T500, dark: colors.T300 })(akTheme),
      titleColor: themed({ light: colors.P300, dark: colors.P100 })(akTheme),
      sectionColor: themed({ light: colors.P300, dark: colors.P100 })(akTheme),
      commentColor: themed({ light: colors.N400, dark: colors.DN400 })(akTheme),
      metaKeywordColor: themed({ light: colors.G300, dark: colors.G300 })(
        akTheme,
      ),
      metaColor: themed({ light: colors.N400, dark: colors.DN400 })(akTheme),
      functionColor: themed({ light: colors.N800, dark: colors.DN800 })(
        akTheme,
      ),
      numberColor: themed({ light: colors.B400, dark: colors.B100 })(akTheme),
    };
  },
);
