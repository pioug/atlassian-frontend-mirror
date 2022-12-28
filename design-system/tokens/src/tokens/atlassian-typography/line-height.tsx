import { LineHeightBaseToken as BaseToken } from '../../palettes/typography-palette';
import { LineHeightTokenSchema, ValueSchema } from '../../types';

const font: ValueSchema<LineHeightTokenSchema<BaseToken>> = {
  font: {
    lineHeight: {
      '100': { value: 'LineHeight100' },
      '200': { value: 'LineHeight200' },
      '300': { value: 'LineHeight300' },
      '400': { value: 'LineHeight400' },
      '500': { value: 'LineHeight500' },
      '600': { value: 'LineHeight600' },
    },
  },
};

export default font;
