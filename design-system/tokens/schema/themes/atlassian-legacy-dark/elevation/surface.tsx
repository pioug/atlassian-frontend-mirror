import type { SurfaceTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/legacy-palette';

const elevation: ValueSchema<SurfaceTokenSchema<BaseToken>> = {
  elevation: {
    surface: {
      '[default]': {
        '[default]': {
          value: 'DN30',
        },
        hovered: {
          value: 'DN40',
        },
        pressed: {
          value: 'DN50',
        },
      },
      sunken: {
        value: 'DN100',
      },
      raised: {
        '[default]': {
          value: 'DN80',
        },
        hovered: {
          value: 'DN90',
        },
        pressed: {
          value: 'DN100',
        },
      },
      overlay: {
        '[default]': {
          value: 'DN200',
        },
        hovered: {
          value: 'DN300',
        },
        pressed: {
          value: 'DN400',
        },
      },
    },
  },
};

export default elevation;
