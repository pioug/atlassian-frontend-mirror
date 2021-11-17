import type { AttributeSchema, UtilTokenSchema } from '../../../types';

const utility: AttributeSchema<UtilTokenSchema> = {
  UNSAFE_util: {
    transparent: {
      attributes: {
        group: 'raw',
        state: 'active',
        description:
          'Transparent token used for backwards compatibility between new and old theming solutions',
      },
    },
    MISSING_TOKEN: {
      attributes: {
        group: 'raw',
        state: 'active',
        description:
          'Used as a placeholder when a suitable token does not exist',
      },
    },
  },
};

export default { utility };
