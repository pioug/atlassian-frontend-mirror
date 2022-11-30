import {
  FontFamilyPaletteTokenSchema,
  FontSizeScaleTokenSchema,
  FontWeightScaleTokenSchema,
  LineHeightScaleTokenSchema,
} from '../../types';

import fontFamilyPalette, { FontFamilyPaletteValues } from './font-family';
import fontSizeScale, { FontSizeScaleValues } from './font-size-scale';
import fontWeightScale, { FontWeightScaleValues } from './font-weight-scale';
import lineHeightScale, { LineHeightScaleValues } from './line-height-scale';

export type AtlassianTokenSchema = {
  typography:
    | FontSizeScaleTokenSchema<FontSizeScaleValues>
    | FontWeightScaleTokenSchema<FontWeightScaleValues>
    | FontFamilyPaletteTokenSchema<FontFamilyPaletteValues>
    | LineHeightScaleTokenSchema<LineHeightScaleValues>;
};

const typographyPalette: AtlassianTokenSchema = {
  typography: {
    ...fontSizeScale,
    ...fontWeightScale,
    ...lineHeightScale,
    ...fontFamilyPalette,
  },
};

export default typographyPalette;
