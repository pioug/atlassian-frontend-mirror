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
            // @ts-ignore new value for Blue1000
            value: '#092957',
          },
        },
        red: {
          subtlest: {
            // @ts-ignore new value for Red1000
            value: '#4F1C16',
          },
        },
        orange: {
          subtlest: {
            // @ts-ignore new value for Orange1000
            value: '#4A2B0F',
          },
        },
        yellow: {
          subtlest: {
            // @ts-ignore new value for Yellow1000
            value: '#3F3102',
          },
        },
        green: {
          subtlest: {
            // @ts-ignore new value for Green1000
            value: '#143C2B',
          },
        },
        purple: {
          subtlest: {
            // @ts-ignore new value for Purple1000
            value: '#2B2451',
          },
        },
        teal: {
          subtlest: {
            // @ts-ignore new value for Teal1000
            value: '#15373B',
          },
        },
        magenta: {
          subtlest: {
            // @ts-ignore new value for Magenta1000
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
