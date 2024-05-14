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
          description: 'Default font weight for body text styles.',
        },
      },
      medium: {
        attributes: {
          group: 'fontWeight',
          state: 'active',
          introduced: '0.10.33',
          description: 'For all text that may appear beside iconography, such as in a button.',
        },
      },
      semibold: {
        attributes: {
          group: 'fontWeight',
          state: 'active',
          introduced: '0.10.33',
          description: 'Use with caution as fallback fonts do not support this font weight and will default to bold weight.',
        },
      },
      bold: {
        attributes: {
          group: 'fontWeight',
          state: 'active',
          introduced: '0.10.33',
          description: 'Use sparingly for emphasising text, such as in a lozenge.',
        },
      },
    },
  },
};

export default font;
