import type { BaseToken } from '../../../palettes/palette';
import type {
  BackgroundColorTokenSchema,
  ExtendedValueSchema,
} from '../../../types';

const color: ExtendedValueSchema<BackgroundColorTokenSchema<BaseToken>> = {
  color: {
    blanket: {
      // @ts-ignore DarkNeutral-100 at 60% not currently available
      '[default]': { value: '#10121499' },
    },
    background: {
      input: {
        '[default]': { value: 'DarkNeutral200' },
        hovered: {
          // @ts-ignore DarkNeutral250 not currently available
          value: '#282E33',
        },
        pressed: { value: 'DarkNeutral200' },
      },
      selected: {
        '[default]': {
          '[default]': {
            // @ts-ignore new value for Blue1000
            value: '#092957',
          },
        },
      },
      danger: {
        '[default]': {
          '[default]': {
            // @ts-ignore new value for Red1000
            value: '#4F1C16',
          },
        },
      },
      warning: {
        '[default]': {
          '[default]': {
            // @ts-ignore new value for Yellow1000
            value: '#3F3102',
          },
        },
      },
      success: {
        '[default]': {
          '[default]': {
            // @ts-ignore new value for Green1000
            value: '#143C2B',
          },
        },
      },
      discovery: {
        '[default]': {
          '[default]': {
            // @ts-ignore new value for Purple1000
            value: '#2B2451',
          },
        },
      },
      information: {
        '[default]': {
          '[default]': {
            // @ts-ignore new value for Blue1000
            value: '#092957',
          },
        },
      },
    },
  },
};

export default color;
