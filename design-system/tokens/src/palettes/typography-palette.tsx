import {
  FontFamilyPaletteTokenSchema,
  FontSizeScaleTokenSchema,
  FontWeightScaleTokenSchema,
  LineHeightScaleTokenSchema,
} from '../types';

export type FontSizeScaleValues =
  | 'FontSize050'
  | 'FontSize075'
  | 'FontSize100'
  | 'FontSize200'
  | 'FontSize300'
  | 'FontSize400'
  | 'FontSize500'
  | 'FontSize600';

export type LineHeightScaleValues =
  | 'LineHeight100'
  | 'LineHeight200'
  | 'LineHeight300'
  | 'LineHeight400'
  | 'LineHeight500'
  | 'LineHeight600';

export type FontWeightScaleValues =
  | 'FontWeightRegular'
  | 'FontWeightMedium'
  | 'FontWeightSemiBold'
  | 'FontWeightBold';

export type FontFamilyPaletteValues = 'FontFamilySans' | 'FontFamilyMonospace';

export type AtlassianTokenSchema = {
  typography:
    | FontSizeScaleTokenSchema<FontSizeScaleValues>
    | FontWeightScaleTokenSchema<FontWeightScaleValues>
    | FontFamilyPaletteTokenSchema<FontFamilyPaletteValues>
    | LineHeightScaleTokenSchema<LineHeightScaleValues>;
};

export type LineHeightBaseToken =
  keyof LineHeightScaleTokenSchema<LineHeightScaleValues>['lineHeight'];

const lineHeightScale: LineHeightScaleTokenSchema<LineHeightScaleValues> = {
  lineHeight: {
    LineHeight100: {
      value: '16px',
      attributes: {
        group: 'scale',
      },
    },
    LineHeight200: {
      value: '20px',
      attributes: {
        group: 'scale',
      },
    },
    LineHeight300: {
      value: '24px',
      attributes: {
        group: 'scale',
      },
    },
    LineHeight400: {
      value: '28px',
      attributes: {
        group: 'scale',
      },
    },
    LineHeight500: {
      value: '32px',
      attributes: {
        group: 'scale',
      },
    },
    LineHeight600: {
      value: '40px',
      attributes: {
        group: 'scale',
      },
    },
  },
};

export type FontWeightBaseToken =
  keyof FontWeightScaleTokenSchema<FontWeightScaleValues>['fontWeight'];

const fontWeightScale: FontWeightScaleTokenSchema<FontWeightScaleValues> = {
  fontWeight: {
    FontWeightRegular: {
      value: '400',
      attributes: {
        group: 'scale',
      },
    },
    FontWeightMedium: {
      value: '500',
      attributes: {
        group: 'scale',
      },
    },
    FontWeightSemiBold: {
      value: '600',
      attributes: {
        group: 'scale',
      },
    },
    FontWeightBold: {
      value: '700',
      attributes: {
        group: 'scale',
      },
    },
  },
};

export type FontFamilyBaseToken =
  keyof FontFamilyPaletteTokenSchema<FontFamilyPaletteValues>['fontFamily'];

const fontFamilyPalette: FontFamilyPaletteTokenSchema<FontFamilyPaletteValues> =
  {
    fontFamily: {
      FontFamilySans: {
        value: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
        attributes: {
          group: 'scale',
        },
      },
      FontFamilyMonospace: {
        value: `"SFMono-Medium", "SF Mono", "Segoe UI Mono", "Roboto Mono", "Ubuntu Mono", Menlo, Consolas, Courier, monospace`,
        attributes: {
          group: 'scale',
        },
      },
    },
  };

export type FontSizeBaseToken =
  keyof FontSizeScaleTokenSchema<FontSizeScaleValues>['fontSize'];

const fontSizeScale: FontSizeScaleTokenSchema<FontSizeScaleValues> = {
  fontSize: {
    FontSize050: {
      value: '11px',
      attributes: {
        group: 'scale',
      },
    },
    FontSize075: {
      value: '12px',
      attributes: {
        group: 'scale',
      },
    },
    FontSize100: {
      value: '14px',
      attributes: {
        group: 'scale',
      },
    },
    FontSize200: {
      value: '16px',
      attributes: {
        group: 'scale',
      },
    },
    FontSize300: {
      value: '20px',
      attributes: {
        group: 'scale',
      },
    },
    FontSize400: {
      value: '24px',
      attributes: {
        group: 'scale',
      },
    },
    FontSize500: {
      value: '29px',
      attributes: {
        group: 'scale',
      },
    },
    FontSize600: {
      value: '35px',
      attributes: {
        group: 'scale',
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
  },
};

export default typographyPalette;
