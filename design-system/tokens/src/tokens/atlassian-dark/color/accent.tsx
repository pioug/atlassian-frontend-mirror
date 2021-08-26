import type { AccentColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<AccentColorTokenSchema> = {
  color: {
    accent: {
      boldBlue: {
        value: 'B700',
      },
      boldGreen: {
        value: 'G700',
      },
      boldOrange: {
        value: 'O700',
      },
      boldPurple: {
        value: 'P700',
      },
      boldRed: {
        value: 'R700',
      },
      boldTeal: {
        value: 'T700',
      },
      subtleBlue: {
        value: 'B900',
      },
      subtleGreen: {
        value: 'G900',
      },
      subtleMagenta: {
        value: 'M900',
      },
      subtleOrange: {
        value: 'O900',
      },
      subtlePurple: {
        value: 'P900',
      },
      subtleRed: {
        value: 'R900',
      },
      subtleTeal: {
        value: 'T900',
      },
    },
  },
};

export default color;
