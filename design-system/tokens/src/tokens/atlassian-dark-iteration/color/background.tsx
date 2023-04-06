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
          '[default]': { value: 'Blue1000' },
          pressed: { value: 'Blue800' },
        },
      },
      danger: {
        '[default]': {
          '[default]': {
            // @ts-ignore Red950 not currently available
            value: '#4F1C16',
          },
          pressed: {
            // @ts-ignore Red850 not currently available
            value: '#872518',
          },
        },
      },
      warning: {
        '[default]': {
          '[default]': {
            // @ts-ignore Yellow950 not currently available
            value: '#473602',
          },
          pressed: {
            // @ts-ignore Yellow850 not currently available
            value: '#6B5103',
          },
        },
      },
      success: {
        '[default]': {
          '[default]': {
            // @ts-ignore Green950 not currently available
            value: '#143E2C',
          },
          pressed: {
            // @ts-ignore Green850 not currently available
            value: '#1B5A40',
          },
        },
      },
      discovery: {
        '[default]': {
          '[default]': {
            // @ts-ignore Purple950 not currently available
            value: '#2B2451',
          },
          pressed: {
            // @ts-ignore Purple850 not currently available
            value: '#4A3D8A',
          },
        },
      },
      information: {
        '[default]': {
          '[default]': {
            // @ts-ignore Blue950 not currently available
            value: '#092957',
          },
          pressed: {
            // @ts-ignore Blue850 not currently available
            value: '#073A83',
          },
        },
      },
    },
  },
};

export default color;
