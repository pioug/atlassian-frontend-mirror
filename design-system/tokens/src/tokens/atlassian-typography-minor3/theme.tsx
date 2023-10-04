import { BaseToken } from '../../palettes/palette';
import type {
  FontFamilyBaseToken,
  FontSizeBaseToken,
  FontWeightBaseToken,
  LetterSpacingBaseToken,
  LineHeightBaseToken,
} from '../../palettes/typography-palette';
import type {
  TypographyTokenSchema,
  UtilTokenSchema,
  ValueSchema,
} from '../../types';

const utility: ValueSchema<UtilTokenSchema<BaseToken>> = {
  // @ts-expect-error in complete utility theme
  UNSAFE: {
    textTransformUppercase: {
      value: 'uppercase',
    },
  },
};

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
      xxlarge: {
        value: {
          fontWeight: 'FontWeight700',
          fontSize: 'FontSize32',
          lineHeight: 'LineHeight600',
          fontFamily: 'font.family.heading',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      xlarge: {
        value: {
          fontWeight: 'FontWeight700',
          fontSize: 'FontSize28',
          lineHeight: 'LineHeight500',
          fontFamily: 'font.family.heading',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      large: {
        value: {
          fontWeight: 'FontWeight700',
          fontSize: 'FontSize24',
          lineHeight: 'LineHeight400',
          fontFamily: 'font.family.heading',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      medium: {
        value: {
          fontWeight: 'FontWeight700',
          fontSize: 'FontSize20',
          lineHeight: 'LineHeight300',
          fontFamily: 'font.family.heading',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      small: {
        value: {
          fontWeight: 'FontWeight700',
          fontSize: 'FontSize16',
          lineHeight: 'LineHeight200',
          fontFamily: 'font.family.heading',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      xsmall: {
        value: {
          fontWeight: 'FontWeight700',
          fontSize: 'FontSize14',
          lineHeight: 'LineHeight100',
          fontFamily: 'font.family.heading',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      xxsmall: {
        value: {
          fontWeight: 'FontWeight700',
          fontSize: 'FontSize12',
          lineHeight: 'LineHeight100',
          fontFamily: 'font.family.heading',
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
          fontFamily: 'font.family.code',
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
          fontFamily: 'font.family.body',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      large: {
        value: {
          fontWeight: 'FontWeight400',
          fontSize: 'FontSize16',
          lineHeight: 'LineHeight300',
          fontFamily: 'font.family.body',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      small: {
        value: {
          fontWeight: 'FontWeight400',
          fontSize: 'FontSize12',
          lineHeight: 'LineHeight200',
          fontFamily: 'font.family.body',
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
          fontFamily: 'font.family.body',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
      small: {
        value: {
          fontWeight: 'FontWeight400',
          fontSize: 'FontSize12',
          lineHeight: 'LineHeight1',
          fontFamily: 'font.family.body',
          fontStyle: 'normal',
          letterSpacing: 'LetterSpacing0',
        },
      },
    },
  },
};

export default {
  font: typography.font,
  utility,
};
