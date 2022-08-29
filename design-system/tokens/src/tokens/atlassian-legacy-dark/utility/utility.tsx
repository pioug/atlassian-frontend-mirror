import type { BaseToken } from '../../../palettes/legacy-palette';
import type { UtilTokenSchema, ValueSchema } from '../../../types';

const utility: ValueSchema<UtilTokenSchema<BaseToken>> = {
  UNSAFE_util: {
    transparent: {
      value: 'transparent',
    },
    MISSING_TOKEN: {
      value: '#FA11F2',
    },
  },
};

export default { utility };
