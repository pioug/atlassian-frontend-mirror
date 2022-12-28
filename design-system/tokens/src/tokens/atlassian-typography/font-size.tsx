import { FontSizeBaseToken as BaseToken } from '../../palettes/typography-palette';
import { FontSizeTokenSchema, ValueSchema } from '../../types';

const font: ValueSchema<FontSizeTokenSchema<BaseToken>> = {
  font: {
    size: {
      '050': { value: 'FontSize050' },
      '075': { value: 'FontSize075' },
      '100': { value: 'FontSize100' },
      '200': { value: 'FontSize200' },
      '300': { value: 'FontSize300' },
      '400': { value: 'FontSize400' },
      '500': { value: 'FontSize500' },
      '600': { value: 'FontSize600' },
    },
  },
};

export default font;
