import type { BaseToken } from '../../../palettes/legacy-palette';
import type { SurfaceTokenSchema, ValueSchema } from '../../../types';

const elevation: ValueSchema<SurfaceTokenSchema<BaseToken>> = {
  elevation: {
    surface: {
      '[default]': {
        '[default]': {
          value: 'N0',
        },
        hovered: {
          value: 'N10',
        },
        pressed: {
          value: 'N20',
        },
      },
      sunken: {
        value: 'N20',
      },
      raised: {
        '[default]': {
          value: 'N0',
        },
        hovered: {
          value: 'N10',
        },
        pressed: {
          value: 'N20',
        },
      },
      overlay: {
        '[default]': {
          value: 'N0',
        },
        hovered: {
          value: 'N10',
        },
        pressed: {
          value: 'N20',
        },
      },
    },
  },
};

export default elevation;
