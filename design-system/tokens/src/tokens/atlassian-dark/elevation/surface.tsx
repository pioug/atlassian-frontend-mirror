import type { BaseToken } from '../../../palettes/palette';
import type { SurfaceTokenSchema, ValueSchema } from '../../../types';

const elevation: ValueSchema<SurfaceTokenSchema<BaseToken>> = {
  elevation: {
    surface: {
      '[default]': {
        '[default]': {
          value: 'DN0',
        },
        hovered: {
          value: 'DN100',
        },
        pressed: {
          value: 'DN200',
        },
      },
      sunken: {
        value: 'DN-100',
      },
      raised: {
        '[default]': {
          value: 'DN100',
        },
        hovered: {
          value: 'DN200',
        },
        pressed: {
          value: 'DN300',
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
