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
          fontWeight: 'FontWeight700',
          fontSize: 'FontSize36',
          lineHeight: 'LineHeight600',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      xl: {
        value: {
          fontWeight: 'FontWeight700',
          fontSize: 'FontSize28',
          lineHeight: 'LineHeight500',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      lg: {
        value: {
          fontWeight: 'FontWeight700',
          fontSize: 'FontSize24',
          lineHeight: 'LineHeight400',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      md: {
        value: {
          fontWeight: 'FontWeight700',
          fontSize: 'FontSize20',
          lineHeight: 'LineHeight300',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      sm: {
        value: {
          fontWeight: 'FontWeight700',
          fontSize: 'FontSize16',
          lineHeight: 'LineHeight200',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      xs: {
        value: {
          fontWeight: 'FontWeight700',
          fontSize: 'FontSize14',
          lineHeight: 'LineHeight100',
          fontFamily: 'FontFamilyWebSans',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      xxs: {
        value: {
          fontWeight: 'FontWeight700',
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
      sm: {
        value: {
          fontWeight: 'FontWeight400',
          fontSize: 'FontSize11',
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
          fontSize: 'FontSize11',
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
