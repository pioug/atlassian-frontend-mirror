import type { BaseToken } from '../../../palettes/palette';
import type {
  AccentColorTokenSchema,
  ExtendedValueSchema,
} from '../../../types';

const color: ExtendedValueSchema<AccentColorTokenSchema<BaseToken>> = {
  color: {
    background: {
      accent: {
        blue: {
          subtlest: {
            // @ts-ignore Blue950 not currently available
            value: '#092957',
          },
        },
        red: {
          subtlest: {
            // @ts-ignore Red950 not currently available
            value: '#4F1C16',
          },
        },
        orange: {
          subtlest: {
            // @ts-ignore Orange950 not currently available
            value: '#513010',
          },
        },
        yellow: {
          subtlest: {
            // @ts-ignore Yellow950 not currently available
            value: '#473602',
          },
        },
        green: {
          subtlest: {
            // @ts-ignore Green950 not currently available
            value: '#143E2C',
          },
        },
        purple: {
          subtlest: {
            // @ts-ignore Purple950 not currently available
            value: '#2B2451',
          },
        },
        teal: {
          subtlest: {
            // @ts-ignore Teal950 not currently available
            value: '#193E42',
          },
        },
        magenta: {
          subtlest: {
            // @ts-ignore Magenta950 not currently available
            value: '#421F34',
          },
        },
        gray: {
          bolder: {
            // @ts-ignore new value for DarkNeautral700
            value: '#8C9BAB',
          },
        },
      },
    },
  },
};

export default color;
