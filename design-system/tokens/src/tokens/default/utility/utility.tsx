import type { AttributeSchema, UtilTokenSchema } from '../../../types';

const utility: AttributeSchema<UtilTokenSchema> = {
  UNSAFE_util: {
    transparent: {
      attributes: {
        description: '',
        group: 'raw',
      },
    },
  },
};

export default { utility };
