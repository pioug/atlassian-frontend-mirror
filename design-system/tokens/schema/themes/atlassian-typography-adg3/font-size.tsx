import { type FontSizeTokenSchema, type ValueSchema } from '../../../src/types';
import { type FontSizeBaseToken as BaseToken } from '../../palettes/typography-palette';

const font: ValueSchema<FontSizeTokenSchema<BaseToken>> = {
  font: {
    size: {
      '050': { value: 'LegacyFontSize11' },
      '075': { value: 'FontSize12' },
      '100': { value: 'FontSize14' },
      '200': { value: 'FontSize16' },
      '300': { value: 'FontSize20' },
      '400': { value: 'FontSize24' },
      '500': { value: 'LegacyFontSize29' },
      '600': { value: 'LegacyFontSize35' },
    },
  },
};

export default font;
