import type { BaseToken } from '../../../palettes/legacy-palette';
import type { AccentColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<AccentColorTokenSchema<BaseToken>> = {
  color: {
    text: {
      accent: {
        blue: {
          '[default]': { value: 'B300' },
          bolder: { value: 'B200' },
        },
        red: {
          '[default]': { value: 'R300' },
          bolder: { value: 'R200' },
        },
        orange: {
          // @ts-expect-error
          '[default]': { value: '#FEC57B' },
          // @ts-expect-error
          bolder: { value: '#F18D13' },
        },
        yellow: {
          '[default]': { value: 'Y300' },
          bolder: { value: 'Y200' },
        },
        green: {
          '[default]': { value: 'G300' },
          bolder: { value: 'G200' },
        },
        purple: {
          '[default]': { value: 'P300' },
          bolder: { value: 'P200' },
        },
        teal: {
          '[default]': { value: 'T300' },
          bolder: { value: 'T200' },
        },
        magenta: {
          // @ts-expect-error
          '[default]': { value: '#F797D2' },
          // @ts-expect-error
          bolder: { value: '#FDD0EC' },
        },
        gray: {
          '[default]': { value: 'DN300' },
          bolder: { value: 'DN500' },
        },
      },
    },
    icon: {
      accent: {
        blue: { value: 'B500' },
        red: { value: 'R500' },
        // @ts-expect-error
        orange: { value: '#F18D13' },
        yellow: { value: 'Y500' },
        green: { value: 'G500' },
        purple: { value: 'P500' },
        teal: { value: 'T500' },
        // @ts-expect-error
        magenta: { value: '#DA62AC' },
        gray: { value: 'DN600' },
      },
    },
    border: {
      accent: {
        blue: { value: 'B500' },
        red: { value: 'R500' },
        // @ts-expect-error
        orange: { value: '#F18D13' },
        yellow: { value: 'Y500' },
        green: { value: 'G500' },
        purple: { value: 'P500' },
        teal: { value: 'T500' },
        // @ts-expect-error
        magenta: { value: '#DA62AC' },
        gray: { value: 'DN600' },
      },
    },
    background: {
      accent: {
        blue: {
          subtlest: { value: 'B500' },
          subtler: { value: 'B400' },
          subtle: { value: 'B300' },
          bolder: { value: 'B100' },
        },
        red: {
          subtlest: { value: 'R500' },
          subtler: { value: 'R400' },
          subtle: { value: 'R300' },
          bolder: { value: 'R100' },
        },
        orange: {
          // @ts-expect-error
          subtlest: { value: '#43290F' },
          // @ts-expect-error
          subtler: { value: '#5F3811' },
          // @ts-expect-error
          subtle: { value: '#974F0C' },
          // @ts-expect-error
          bolder: { value: '#F18D13' },
        },
        yellow: {
          subtlest: { value: 'Y500' },
          subtler: { value: 'Y400' },
          subtle: { value: 'Y300' },
          bolder: { value: 'Y100' },
        },
        green: {
          subtlest: { value: 'G500' },
          subtler: { value: 'G400' },
          subtle: { value: 'G300' },
          bolder: { value: 'G100' },
        },
        purple: {
          subtlest: { value: 'P500' },
          subtler: { value: 'P400' },
          subtle: { value: 'P300' },
          bolder: { value: 'P100' },
        },
        teal: {
          subtlest: { value: 'T500' },
          subtler: { value: 'T400' },
          subtle: { value: 'T300' },
          bolder: { value: 'T100' },
        },
        magenta: {
          // @ts-expect-error
          subtlest: { value: '#341829' },
          // @ts-expect-error
          subtler: { value: '#50253F' },
          // @ts-expect-error
          subtle: { value: '#943D73' },
          // @ts-expect-error
          bolder: { value: '#E774BB' },
        },
        gray: {
          subtlest: { value: 'DN300' },
          subtler: { value: 'DN400' },
          subtle: { value: 'DN500' },
          bolder: { value: 'DN700' },
        },
      },
    },
  },
};

export default color;
