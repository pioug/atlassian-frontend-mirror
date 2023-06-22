import type { BaseToken } from '../../../palettes/palette';
import type { SurfaceTokenSchema, ValueSchema } from '../../../types';

const elevation: ValueSchema<SurfaceTokenSchema<BaseToken>> = {
  elevation: {
    surface: {
      '[default]': {
        '[default]': {
          value: 'DarkNeutral100',
        },
        hovered: {
          value: 'DarkNeutral200',
        },
        pressed: {
          value: 'DarkNeutral250',
        },
      },
      sunken: {
        value: 'DarkNeutral0',
      },
      raised: {
        '[default]': {
          value: 'DarkNeutral200',
        },
        hovered: {
          value: 'DarkNeutral250',
        },
        pressed: {
          value: 'DarkNeutral300',
        },
      },
      overlay: {
        '[default]': {
          value: 'DarkNeutral250',
        },
        hovered: {
          value: 'DarkNeutral300',
        },
        pressed: {
          value: 'DarkNeutral350',
        },
      },
    },
  },
};

export default elevation;
