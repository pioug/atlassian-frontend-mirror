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
};

export default { utility };
