import type { BaseToken } from '../../../palettes/palette';
import type { SurfaceTokenSchema, ValueSchema } from '../../../types';

const elevation: ValueSchema<SurfaceTokenSchema<BaseToken>> = {
  elevation: {
    surface: {
      '[default]': {
        '[default]': {
          value: 'DarkNeutral0',
        },
        hovered: {
          value: 'DarkNeutral100',
        },
        pressed: {
          value: 'DarkNeutral200',
        },
      },
      sunken: {
        value: 'DarkNeutral-100',
      },
      raised: {
        '[default]': {
          value: 'DarkNeutral100',
        },
        hovered: {
          value: 'DarkNeutral200',
        },
        pressed: {
          value: 'DarkNeutral300',
        },
      },
      overlay: {
        '[default]': {
          value: 'DarkNeutral200',
        },
        hovered: {
          value: 'DarkNeutral300',
        },
        pressed: {
          value: 'DarkNeutral400',
        },
      },
    },
  },
};

export default elevation;
