import type { BaseToken } from '../../../palettes/palette';
import type { AttributeSchema, UtilTokenSchema } from '../../../types';

const utility: AttributeSchema<UtilTokenSchema<BaseToken>> = {
  UNSAFE: {
    transparent: {
      attributes: {
        group: 'raw',
        state: 'active',
        introduced: '0.1.1',
        description:
          'Transparent token used for backwards compatibility between new and old theming solutions',
      },
    },
  },
  elevation: {
    surface: {
      current: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '1.14.0',
          description: `A dynamic token that represents the current surface color set by a parent element. It defaults to the 'elevation.surface' token value.`,
        },
      },
    },
  },
};

export default { utility };
