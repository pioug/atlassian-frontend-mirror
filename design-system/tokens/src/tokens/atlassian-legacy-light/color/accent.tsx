import type { BaseToken } from '../../../palettes/legacy-palette';
import type { AccentColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<AccentColorTokenSchema<BaseToken>> = {
  color: {
    text: {
      accent: {
        blue: {
          '[default]': { value: 'B400' },
          bolder: { value: 'B500' },
        },
        red: {
          '[default]': { value: 'R400' },
          bolder: { value: 'R500' },
        },
        orange: {
          // @ts-expect-error
          '[default]': { value: '#F18D13' },
          // @ts-expect-error
          bolder: { value: '#B65C02' },
        },
        yellow: {
          '[default]': { value: 'Y400' },
          bolder: { value: 'Y500' },
        },
        green: {
          '[default]': { value: 'G400' },
          bolder: { value: 'G500' },
        },
        purple: {
          '[default]': { value: 'P400' },
          bolder: { value: 'P500' },
        },
        teal: {
          '[default]': { value: 'T400' },
          bolder: { value: 'T500' },
        },
        magenta: {
          // @ts-expect-error
          '[default]': { value: '#E774BB' },
          // @ts-expect-error
          bolder: { value: '#DA62AC' },
        },
        lime: {
          // @ts-expect-error
          '[default]': { value: '#4C6B1F' },
          // @ts-expect-error
          bolder: { value: '#37471F' },
        },
        gray: {
          '[default]': { value: 'N400' },
          bolder: { value: 'N800' },
        },
      },
    },
    icon: {
      accent: {
        blue: { value: 'B300' },
        red: { value: 'R300' },
        // @ts-expect-error
        orange: { value: '#D94008' },
        yellow: { value: 'Y300' },
        green: { value: 'G300' },
        purple: { value: 'P300' },
        teal: { value: 'T300' },
        // @ts-expect-error
        magenta: { value: '#CD519D' },
        // @ts-expect-error
        lime: { value: '#6A9A23' },
        gray: { value: 'N300' },
      },
    },
    border: {
      accent: {
        blue: { value: 'B300' },
        red: { value: 'R300' },
        // @ts-expect-error
        orange: { value: '#D94008' },
        yellow: { value: 'Y300' },
        green: { value: 'G300' },
        purple: { value: 'P300' },
        teal: { value: 'T300' },
        // @ts-expect-error
        magenta: { value: '#CD519D' },
        // @ts-expect-error
        lime: { value: '#6A9A23' },
        gray: { value: 'N300' },
      },
    },
    background: {
      accent: {
        blue: {
          subtlest: { value: 'B100' },
          subtler: { value: 'B200' },
          subtle: { value: 'B400' },
          bolder: { value: 'B400' },
        },
        red: {
          subtlest: { value: 'R100' },
          subtler: { value: 'R200' },
          subtle: { value: 'R400' },
          bolder: { value: 'R400' },
        },
        orange: {
          // @ts-expect-error
          subtlest: { value: '#F18D13' },
          // @ts-expect-error
          subtler: { value: '#B65C02' },
          // @ts-expect-error
          subtle: { value: '#5F3811' },
          // @ts-expect-error
          bolder: { value: '#43290F' },
        },
        yellow: {
          subtlest: { value: 'Y100' },
          subtler: { value: 'Y200' },
          subtle: { value: 'Y400' },
          bolder: { value: 'Y400' },
        },
        green: {
          subtlest: { value: 'G100' },
          subtler: { value: 'G200' },
          subtle: { value: 'G400' },
          bolder: { value: 'G400' },
        },
        purple: {
          subtlest: { value: 'P100' },
          subtler: { value: 'P200' },
          subtle: { value: 'P400' },
          bolder: { value: 'P400' },
        },
        teal: {
          subtlest: { value: 'T100' },
          subtler: { value: 'T200' },
          subtle: { value: 'T400' },
          bolder: { value: 'T400' },
        },
        magenta: {
          // @ts-expect-error
          subtlest: { value: '#E774BB' },
          // @ts-expect-error
          subtler: { value: '#E774BB' },
          // @ts-expect-error
          subtle: { value: '#E774BB' },
          // @ts-expect-error
          bolder: { value: '#E774BB' },
        },
        lime: {
          // @ts-expect-error
          subtlest: { value: '#EEFBDA' },
          // @ts-expect-error
          subtler: { value: '#D3F1A7' },
          // @ts-expect-error
          subtle: { value: '#94C748' },
          // @ts-expect-error
          bolder: { value: '#5B7F24' },
        },
        gray: {
          subtlest: { value: 'N200' },
          subtler: { value: 'N300' },
          subtle: { value: 'N500' },
          bolder: { value: 'N400' },
        },
      },
    },
  },
};

export default color;
