import type { AccentColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<AccentColorTokenSchema> = {
  color: {
    accent: {
      boldBlue: {
        value: 'B400',
      },
      boldGreen: {
        value: 'G400',
      },
      boldOrange: {
        value: 'O400',
      },
      boldPurple: {
        value: 'P400',
      },
      boldRed: {
        value: 'R400',
      },
      boldTeal: {
        value: 'T400',
      },
      subtleBlue: {
        value: 'B200',
      },
      subtleGreen: {
        value: 'G200',
      },
      subtleMagenta: {
        value: 'M200',
      },
      subtleOrange: {
        value: 'O200',
      },
      subtlePurple: {
        value: 'P200',
      },
      subtleRed: {
        value: 'R200',
      },
      subtleTeal: {
        value: 'T200',
      },
    },
  },
};

export default color;
