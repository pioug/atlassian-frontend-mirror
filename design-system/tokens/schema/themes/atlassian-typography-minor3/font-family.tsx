import { FontFamilyTokenSchema, ValueSchema } from '../../../src/types';
import { FontFamilyBaseToken as BaseToken } from '../../palettes/typography-palette';

const font: ValueSchema<FontFamilyTokenSchema<BaseToken>> = {
  font: {
    family: {
      sans: { value: 'FontFamilyWebSans' },
      monospace: { value: 'FontFamilyWebMono' },
      body: { value: 'FontFamilyWebSans' },
      heading: { value: 'FontFamilyWebSans' },
      brand: {
        heading: { value: 'FontFamilyCharlieDisplay' },
        body: { value: 'FontFamilyCharlieText' },
      },
      code: { value: 'FontFamilyWebMono' },
    },
  },
};

export default font;
