import type { BaseToken } from '../../../palettes/palette';
import type { SurfaceTokenSchema, ValueSchema } from '../../../types';

const elevation: ValueSchema<SurfaceTokenSchema<BaseToken>> = {
  elevation: {
    surface: {
      '[default]': {
        '[default]': {
          value: 'N0',
        },
        hovered: {
          value: 'N200',
        },
        pressed: {
          value: 'N300',
        },
      },
      sunken: {
        value: 'N100',
      },
      raised: {
        '[default]': {
          value: 'N0',
        },
        hovered: {
          value: 'N200',
        },
        pressed: {
          value: 'N300',
        },
      },
      overlay: {
        '[default]': {
          value: 'N0',
        },
        hovered: {
          value: 'N200',
        },
        pressed: {
          value: 'N300',
        },
      },
    },
  },
};

export default elevation;
