import { FontFamilyBaseToken as BaseToken } from '../../palettes/typography-palette';
import { FontFamilyTokenSchema, ValueSchema } from '../../types';

const font: ValueSchema<FontFamilyTokenSchema<BaseToken>> = {
  font: {
    family: {
      sans: { value: 'FontFamilyWebSans' },
      monospace: { value: 'FontFamilyWebMono' },
      body: { value: 'FontFamilyWebSans' },
      heading: { value: 'FontFamilyWebSans' },
      brand: { value: 'FontFamilyCharlie' },
      code: { value: 'FontFamilyWebMono' },
    },
  },
};

export default font;
