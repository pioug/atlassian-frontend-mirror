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
        group: 'typography',
      },
    },
    LineHeight200: {
      value: '20px',
      attributes: {
        group: 'typography',
      },
    },
    LineHeight300: {
      value: '24px',
      attributes: {
        group: 'typography',
      },
    },
    LineHeight400: {
      value: '28px',
      attributes: {
        group: 'typography',
      },
    },
    LineHeight500: {
      value: '32px',
      attributes: {
        group: 'typography',
      },
    },
    LineHeight600: {
      value: '40px',
      attributes: {
        group: 'typography',
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
        group: 'typography',
      },
    },
    FontWeightMedium: {
      value: '500',
      attributes: {
        group: 'typography',
      },
    },
    FontWeightSemiBold: {
      value: '600',
      attributes: {
        group: 'typography',
      },
    },
    FontWeightBold: {
      value: '700',
      attributes: {
        group: 'typography',
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
          group: 'typography',
        },
      },
      FontFamilyMonospace: {
        value: `"SFMono-Medium", "SF Mono", "Segoe UI Mono", "Roboto Mono", "Ubuntu Mono", Menlo, Consolas, Courier, monospace`,
        attributes: {
          group: 'typography',
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
        group: 'typography',
      },
    },
    FontSize075: {
      value: '12px',
      attributes: {
        group: 'typography',
      },
    },
    FontSize100: {
      value: '14px',
      attributes: {
        group: 'typography',
      },
    },
    FontSize200: {
      value: '16px',
      attributes: {
        group: 'typography',
      },
    },
    FontSize300: {
      value: '20px',
      attributes: {
        group: 'typography',
      },
    },
    FontSize400: {
      value: '24px',
      attributes: {
        group: 'typography',
      },
    },
    FontSize500: {
      value: '29px',
      attributes: {
        group: 'typography',
      },
    },
    FontSize600: {
      value: '35px',
      attributes: {
        group: 'typography',
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
