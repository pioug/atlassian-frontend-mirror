import { type FontWeightTokenSchema, type ValueSchema } from '../../../src/types';
import { type FontWeightBaseToken as BaseToken } from '../../palettes/typography-palette';

const font: ValueSchema<FontWeightTokenSchema<BaseToken>> = {
  font: {
    weight: {
      regular: { value: 'FontWeight400' },
      medium: { value: 'FontWeight500' },
      semibold: { value: 'FontWeight600' },
      bold: { value: 'FontWeight700' },
    },
  },
};

export default font;
