import type {
  AttributeSchema,
  FontWeightTokenSchema,
} from '../../../src/types';
import type { FontWeightBaseToken as BaseToken } from '../../palettes/typography-palette';

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
