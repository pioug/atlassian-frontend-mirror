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
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      medium: {
        attributes: {
          group: 'fontWeight',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      semibold: {
        attributes: {
          group: 'fontWeight',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      bold: {
        attributes: {
          group: 'fontWeight',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
    },
  },
};

export default font;
