import type { UtilTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';
import elevation from '../elevation/surface';

const utility: ValueSchema<UtilTokenSchema<BaseToken>> = {
  UNSAFE: {
    transparent: {
      value: 'transparent',
    },
  },
  elevation: {
    surface: {
      current: {
        value: elevation.elevation.surface['[default]']['[default]'].value,
      },
    },
  },
};

export default { utility };
