import { LineHeightTokenSchema, ValueSchema } from '../../../src/types';
import { LineHeightBaseToken as BaseToken } from '../../palettes/typography-palette';

const font: ValueSchema<LineHeightTokenSchema<BaseToken>> = {
  font: {
    lineHeight: {
      '1': { value: 'LineHeight1' },
      '100': { value: 'LineHeight100' },
      '200': { value: 'LineHeight200' },
      '300': { value: 'LineHeight300' },
      '400': { value: 'LineHeight400' },
      '500': { value: 'LineHeight500' },
      '600': { value: 'LineHeight700' },
    },
  },
};

export default font;
