import type { BaseToken } from '../../../palettes/legacy-palette';
import type { SurfaceTokenSchema, ValueSchema } from '../../../types';

const elevation: ValueSchema<SurfaceTokenSchema<BaseToken>> = {
  elevation: {
    surface: {
      '[default]': {
        value: 'DN30',
      },
      sunken: {
        value: 'DN100',
      },
      raised: {
        value: 'DN80',
      },
      overlay: {
        value: 'DN200',
      },
    },
  },
};

export default elevation;
