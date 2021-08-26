import type { UtilTokenSchema, ValueSchema } from '../../../types';

const utility: ValueSchema<UtilTokenSchema> = {
  UNSAFE_util: {
    transparent: {
      value: 'transparent',
    },
  },
};

export default { utility };
