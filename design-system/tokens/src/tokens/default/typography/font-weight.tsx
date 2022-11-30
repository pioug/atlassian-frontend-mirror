import type { BaseToken } from '../../../palettes/typography/font-weight-scale';
import type { AttributeSchema, FontWeightTokenSchema } from '../../../types';

const font: AttributeSchema<FontWeightTokenSchema<BaseToken>> = {
  font: {
    weight: {
      regular: {
        attributes: {
          group: 'fontWeight',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
      medium: {
        attributes: {
          group: 'fontWeight',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
      semibold: {
        attributes: {
          group: 'fontWeight',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
      bold: {
        attributes: {
          group: 'fontWeight',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
    },
  },
};

export default font;
