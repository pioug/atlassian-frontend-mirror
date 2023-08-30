import type {
  FontFamilyBaseToken,
  FontSizeBaseToken,
  FontWeightBaseToken,
  LetterSpacingBaseToken,
  LineHeightBaseToken,
} from '../../palettes/typography-palette';
import type { TypographyTokenSchema, ValueSchema } from '../../types';

const typography: ValueSchema<
  TypographyTokenSchema<{
    fontWeight: FontWeightBaseToken;
    fontFamily: FontFamilyBaseToken;
    fontSize: FontSizeBaseToken;
    lineHeight: LineHeightBaseToken;
    letterSpacing: LetterSpacingBaseToken;
  }>
> = {
  font: {
    heading: {
      xxl: {
        value: {
          fontWeight: 'FontWeight500',
          fontSize: 'LegacyFontSize35',
          lineHeight: 'LineHeight700',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing400',
        },
      },
      xl: {
        value: {
          fontWeight: 'FontWeight600',
          fontSize: 'LegacyFontSize29',
          lineHeight: 'LineHeight500',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing400',
        },
      },
      lg: {
        value: {
          fontWeight: 'FontWeight500',
          fontSize: 'FontSize24',
          lineHeight: 'LineHeight400',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing400',
        },
      },
      md: {
        value: {
          fontWeight: 'FontWeight500',
          fontSize: 'FontSize20',
          lineHeight: 'LineHeight300',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing300',
        },
      },
      sm: {
        value: {
          fontWeight: 'FontWeight600',
          fontSize: 'FontSize16',
          lineHeight: 'LineHeight200',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing200',
        },
      },
      xs: {
        value: {
          fontWeight: 'FontWeight600',
          fontSize: 'FontSize14',
          lineHeight: 'LineHeight100',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing100',
        },
      },
      xxs: {
        value: {
          fontWeight: 'FontWeight600',
          fontSize: 'FontSize12',
          lineHeight: 'LineHeight100',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
    },
    code: {
      '[default]': {
        value: {
          fontWeight: 'FontWeight400',
          fontSize: 'FontSizeCode',
          lineHeight: 'LineHeight1',
          fontFamily: 'FontFamilyWebMono',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
    },
    body: {
      '[default]': {
        value: {
          fontWeight: 'FontWeight400',
          fontSize: 'FontSize14',
          lineHeight: 'LineHeight200',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      lg: {
        value: {
          fontWeight: 'FontWeight400',
          fontSize: 'FontSize16',
          lineHeight: 'LineHeight300',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      sm: {
        value: {
          fontWeight: 'FontWeight400',
          fontSize: 'LegacyFontSize11',
          lineHeight: 'LineHeight200',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
    },
    ui: {
      '[default]': {
        value: {
          fontWeight: 'FontWeight400',
          fontSize: 'FontSize14',
          lineHeight: 'LineHeight1',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      sm: {
        value: {
          fontWeight: 'FontWeight400',
          fontSize: 'LegacyFontSize11',
          lineHeight: 'LineHeight1',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
    },
  },
};

export default typography;
