import type { BaseToken } from '../../../palettes/legacy-palette';
import type { SurfaceTokenSchema, ValueSchema } from '../../../types';

const elevation: ValueSchema<SurfaceTokenSchema<BaseToken>> = {
  elevation: {
    surface: {
      '[default]': {
        value: 'N0',
      },
      sunken: {
        value: 'N20',
      },
      raised: {
        value: 'N0',
      },
      overlay: {
        value: 'N0',
      },
    },
  },
};

export default elevation;
