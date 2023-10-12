import {
  FontFamilyPaletteTokenSchema,
  FontSizeScaleTokenSchema,
  FontWeightScaleTokenSchema,
  LetterSpacingScaleTokenSchema,
  LineHeightScaleTokenSchema,
} from '../../src/types';

export type FontSizeScaleValues =
  | 'FontSizeCode'
  | 'LegacyFontSize11'
  | 'FontSize12'
  | 'FontSize14'
  | 'FontSize16'
  | 'FontSize20'
  | 'FontSize24'
  | 'FontSize28'
  | 'LegacyFontSize29'
  | 'FontSize32'
  | 'LegacyFontSize35'
  | 'FontSize36'
  | 'FontSize48';

export type LineHeightScaleValues =
  | 'LineHeight1'
  | 'LineHeight050'
  | 'LineHeight100'
  | 'LineHeight200'
  | 'LineHeight300'
  | 'LineHeight400'
  | 'LineHeight500'
  | 'LineHeight600'
  | 'LineHeight700';

export type FontWeightScaleValues =
  | 'FontWeight400'
  | 'FontWeight500'
  | 'FontWeight600'
  | 'FontWeight700';

export type FontFamilyPaletteValues =
  | 'FontFamilyCharlie'
  | 'FontFamilyWebSans'
  | 'LegacyFontFamilyWebSans'
  | 'FontFamilyiOSSans'
  | 'FontFamilyAndroidSans'
  | 'FontFamilyWebMono'
  | 'FontFamilyiOSMono'
  | 'FontFamilyAndroidMono';

export type LetterSpacingScaleValues =
  | 'LetterSpacing0'
  | 'LetterSpacing100'
  | 'LetterSpacing200'
  | 'LetterSpacing300'
  | 'LetterSpacing400';

export type AtlassianTokenSchema = {
  typography:
    | FontSizeScaleTokenSchema<FontSizeScaleValues>
    | FontWeightScaleTokenSchema<FontWeightScaleValues>
    | FontFamilyPaletteTokenSchema<FontFamilyPaletteValues>
    | LineHeightScaleTokenSchema<LineHeightScaleValues>
    | LetterSpacingScaleTokenSchema<LetterSpacingScaleValues>;
};

export type LetterSpacingBaseToken =
  keyof LetterSpacingScaleTokenSchema<LetterSpacingScaleValues>['letterSpacing'];

const letterSpacingScale: LetterSpacingScaleTokenSchema<LetterSpacingScaleValues> =
  {
    letterSpacing: {
      LetterSpacing0: {
        value: '0',
        attributes: {
          group: 'letterSpacing',
        },
      },
      LetterSpacing100: {
        value: '-0.003em',
        attributes: {
          group: 'letterSpacing',
        },
      },
      LetterSpacing200: {
        value: '-0.006em',
        attributes: {
          group: 'letterSpacing',
        },
      },
      LetterSpacing300: {
        value: '-0.008em',
        attributes: {
          group: 'letterSpacing',
        },
      },
      LetterSpacing400: {
        value: '-0.01em',
        attributes: {
          group: 'letterSpacing',
        },
      },
    },
  };

export type LineHeightBaseToken =
  keyof LineHeightScaleTokenSchema<LineHeightScaleValues>['lineHeight'];

const lineHeightScale: LineHeightScaleTokenSchema<LineHeightScaleValues> = {
  lineHeight: {
    LineHeight1: {
      value: '1',
      attributes: {
        group: 'lineHeight',
      },
    },
    LineHeight050: {
      value: 12,
      attributes: {
        group: 'lineHeight',
      },
    },
    LineHeight100: {
      value: 16,
      attributes: {
        group: 'lineHeight',
      },
    },
    LineHeight200: {
      value: 20,
      attributes: {
        group: 'lineHeight',
      },
    },
    LineHeight300: {
      value: 24,
      attributes: {
        group: 'lineHeight',
      },
    },
    LineHeight400: {
      value: 28,
      attributes: {
        group: 'lineHeight',
      },
    },
    LineHeight500: {
      value: 32,
      attributes: {
        group: 'lineHeight',
      },
    },
    LineHeight600: {
      value: 36,
      attributes: {
        group: 'lineHeight',
      },
    },
    LineHeight700: {
      value: 40,
      attributes: {
        group: 'lineHeight',
      },
    },
  },
};

export type FontWeightBaseToken =
  keyof FontWeightScaleTokenSchema<FontWeightScaleValues>['fontWeight'];

const fontWeightScale: FontWeightScaleTokenSchema<FontWeightScaleValues> = {
  fontWeight: {
    FontWeight400: {
      value: '400',
      attributes: {
        group: 'fontWeight',
      },
    },
    FontWeight500: {
      value: '500',
      attributes: {
        group: 'fontWeight',
      },
    },
    FontWeight600: {
      value: '600',
      attributes: {
        group: 'fontWeight',
      },
    },
    FontWeight700: {
      value: '700',
      attributes: {
        group: 'fontWeight',
      },
    },
  },
};

export type FontFamilyBaseToken =
  keyof FontFamilyPaletteTokenSchema<FontFamilyPaletteValues>['fontFamily'];

const fontFamilyPalette: FontFamilyPaletteTokenSchema<FontFamilyPaletteValues> =
  {
    fontFamily: {
      FontFamilyCharlie: {
        value: 'Charlie Sans',
        attributes: {
          group: 'fontFamily',
        },
      },
      LegacyFontFamilyWebSans: {
        value: `-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Roboto\", \"Oxygen\", \"Ubuntu\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\", sans-serif`,
        attributes: {
          group: 'fontFamily',
        },
      },
      /**
       * @see https://infinnie.github.io/blog/2017/systemui.html
       * @see https://github.com/twbs/bootstrap/pull/22377
       * @see https://fonts.google.com/knowledge/glossary/system_font_web_safe_font
       */
      FontFamilyWebSans: {
        value: `ui-sans-serif, \"Segoe UI\", Ubuntu, system-ui, \"Helvetica Neue\", sans-serif`,
        attributes: {
          group: 'fontFamily',
        },
      },
      FontFamilyiOSSans: {
        value: 'SF Pro',
        attributes: {
          group: 'fontFamily',
        },
      },
      FontFamilyAndroidSans: {
        value: 'Roboto',
        attributes: {
          group: 'fontFamily',
        },
      },
      FontFamilyWebMono: {
        value: `ui-monospace, Menlo, \"Segoe UI Mono\", \"Ubuntu Mono\", monospace`,
        attributes: {
          group: 'fontFamily',
        },
      },
      FontFamilyiOSMono: {
        value: 'SF Mono',
        attributes: {
          group: 'fontFamily',
        },
      },
      FontFamilyAndroidMono: {
        value: 'Roboto Mono',
        attributes: {
          group: 'fontFamily',
        },
      },
    },
  };

export type FontSizeBaseToken =
  keyof FontSizeScaleTokenSchema<FontSizeScaleValues>['fontSize'];

const fontSizeScale: FontSizeScaleTokenSchema<FontSizeScaleValues> = {
  fontSize: {
    FontSizeCode: {
      value: '0.875em',
      attributes: {
        group: 'fontSize',
      },
    },
    LegacyFontSize11: {
      value: 11,
      attributes: {
        group: 'fontSize',
      },
    },
    FontSize12: {
      value: 12,
      attributes: {
        group: 'fontSize',
      },
    },
    FontSize14: {
      value: 14,
      attributes: {
        group: 'fontSize',
      },
    },
    FontSize16: {
      value: 16,
      attributes: {
        group: 'fontSize',
      },
    },
    FontSize20: {
      value: 20,
      attributes: {
        group: 'fontSize',
      },
    },
    FontSize24: {
      value: 24,
      attributes: {
        group: 'fontSize',
      },
    },
    FontSize28: {
      value: 28,
      attributes: {
        group: 'fontSize',
      },
    },
    LegacyFontSize29: {
      value: 29,
      attributes: {
        group: 'fontSize',
      },
    },
    FontSize32: {
      value: 32,
      attributes: {
        group: 'fontSize',
      },
    },
    LegacyFontSize35: {
      value: 35,
      attributes: {
        group: 'fontSize',
      },
    },
    FontSize36: {
      value: 36,
      attributes: {
        group: 'fontSize',
      },
    },
    FontSize48: {
      value: 48,
      attributes: {
        group: 'fontSize',
      },
    },
  },
};

const typographyPalette: AtlassianTokenSchema = {
  typography: {
    ...fontSizeScale,
    ...fontWeightScale,
    ...fontFamilyPalette,
    ...lineHeightScale,
    ...letterSpacingScale,
  },
};

export default typographyPalette;
