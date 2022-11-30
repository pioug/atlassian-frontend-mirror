import { FontFamilyPaletteTokenSchema } from '../../types';

export type FontFamilyPaletteValues = 'FontFamilySans' | 'FontFamilyMonospace';

export type BaseToken =
  keyof FontFamilyPaletteTokenSchema<FontFamilyPaletteValues>['fontFamily'];

const palette: FontFamilyPaletteTokenSchema<FontFamilyPaletteValues> = {
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

export default palette;
