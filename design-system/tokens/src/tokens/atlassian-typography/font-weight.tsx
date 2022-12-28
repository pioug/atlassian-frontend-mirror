import { FontWeightBaseToken as BaseToken } from '../../palettes/typography-palette';
import { FontWeightTokenSchema, ValueSchema } from '../../types';

const font: ValueSchema<FontWeightTokenSchema<BaseToken>> = {
  font: {
    weight: {
      regular: { value: 'FontWeightRegular' },
      medium: { value: 'FontWeightMedium' },
      semibold: { value: 'FontWeightSemiBold' },
      bold: { value: 'FontWeightBold' },
    },
  },
};

export default font;
