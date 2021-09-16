import type { AttributeSchema, UtilTokenSchema } from '../../../types';

const utility: AttributeSchema<UtilTokenSchema> = {
  UNSAFE_util: {
    transparent: {
      attributes: {
        description:
          'Transparent token used for backwards compatibility between new and old theming solutions',
        group: 'raw',
      },
    },
  },
};

export default { utility };
