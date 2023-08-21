import type { FontFamilyBaseToken as BaseToken } from '../../../palettes/typography-palette';
import type { AttributeSchema, FontFamilyTokenSchema } from '../../../types';

const font: AttributeSchema<FontFamilyTokenSchema<BaseToken>> = {
  font: {
    family: {
      sans: {
        attributes: {
          group: 'fontFamily',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
      monospace: {
        attributes: {
          group: 'fontFamily',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
      code: {
        attributes: {
          group: 'fontFamily',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'Helpful guidance goes here',
        },
      },
      brand: {
        attributes: {
          group: 'fontFamily',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'Helpful guidance goes here',
        },
      },
      product: {
        attributes: {
          group: 'fontFamily',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'Helpful guidance goes here',
        },
      },
    },
  },
};

export default font;
