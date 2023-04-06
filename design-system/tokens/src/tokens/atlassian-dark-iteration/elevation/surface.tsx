import type { BaseToken } from '../../../palettes/palette';
import type { ExtendedValueSchema, SurfaceTokenSchema } from '../../../types';

const elevation: ExtendedValueSchema<SurfaceTokenSchema<BaseToken>> = {
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
          // @ts-ignore DarkNeutral250 not currently available
          value: '#282E33',
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
          // @ts-ignore DarkNeutral250 not currently available
          value: '#282E33',
        },
      },
      overlay: {
        '[default]': {
          // @ts-ignore DarkNeutral250 not currently available
          value: '#282E33',
        },
        pressed: {
          // @ts-ignore DarkNeutral350 not currently available
          value: '#38414A',
        },
      },
    },
  },
};

export default elevation;
