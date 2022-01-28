import type { SurfaceTokenSchema, ValueSchema } from '../../../types';

const elevation: ValueSchema<SurfaceTokenSchema> = {
  elevation: {
    surface: {
      '[default]': {
        value: 'N0',
      },
      sunken: {
        value: 'N100A',
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
