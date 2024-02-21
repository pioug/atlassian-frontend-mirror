import type {
  AttributeSchema,
  FontFamilyTokenSchema,
} from '../../../src/types';
import type { FontFamilyBaseToken as BaseToken } from '../../palettes/typography-palette';

const font: AttributeSchema<FontFamilyTokenSchema<BaseToken>> = {
  font: {
    family: {
      sans: {
        attributes: {
          group: 'fontFamily',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      monospace: {
        attributes: {
          group: 'fontFamily',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      code: {
        attributes: {
          group: 'fontFamily',
          state: 'deprecated',
          introduced: '1.14.0',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      brand: {
        heading: {
          attributes: {
            group: 'fontFamily',
            state: 'active',
            introduced: '1.14.0',
            description: 'Use for branded headings.',
          },
        },
        body: {
          attributes: {
            group: 'fontFamily',
            state: 'active',
            introduced: '1.14.0',
            description: 'Use for branded body text.',
          },
        },
      },
      heading: {
        attributes: {
          group: 'fontFamily',
          state: 'deprecated',
          introduced: '1.14.0',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      body: {
        attributes: {
          group: 'fontFamily',
          state: 'deprecated',
          introduced: '1.14.0',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
    },
  },
};

export default font;
