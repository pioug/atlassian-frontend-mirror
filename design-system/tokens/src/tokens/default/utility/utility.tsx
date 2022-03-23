import type { AttributeSchema, UtilTokenSchema } from '../../../types';

const utility: AttributeSchema<UtilTokenSchema> = {
  UNSAFE_util: {
    transparent: {
      attributes: {
        group: 'raw',
        state: 'active',
        introduced: '0.1.1',
        description:
          'Transparent token used for backwards compatibility between new and old theming solutions',
      },
    },
    MISSING_TOKEN: {
      attributes: {
        group: 'raw',
        state: 'active',
        introduced: '0.4.0',
        description:
          'Used as a placeholder when a suitable token does not exist',
      },
    },
  },
};

export default { utility };
