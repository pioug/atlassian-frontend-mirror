import type { BaseToken } from '../../../palettes/palette';
import type { AccentColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<AccentColorTokenSchema<BaseToken>> = {
  color: {
    text: {
      accent: {
        blue: {
          '[default]': { value: 'Blue300' },
          bolder: { value: 'Blue200' },
        },
        red: {
          '[default]': { value: 'Red300' },
          bolder: { value: 'Red200' },
        },
        orange: {
          '[default]': { value: 'Orange300' },
          bolder: { value: 'Orange200' },
        },
        yellow: {
          '[default]': { value: 'Yellow300' },
          bolder: { value: 'Yellow200' },
        },
        green: {
          '[default]': { value: 'Green300' },
          bolder: { value: 'Green200' },
        },
        purple: {
          '[default]': { value: 'Purple300' },
          bolder: { value: 'Purple200' },
        },
        teal: {
          '[default]': { value: 'Teal300' },
          bolder: { value: 'Teal200' },
        },
        magenta: {
          '[default]': { value: 'Magenta300' },
          bolder: { value: 'Magenta200' },
        },
        lime: {
          '[default]': { value: 'Lime300' },
          bolder: { value: 'Lime200' },
        },
        gray: {
          '[default]': { value: 'DarkNeutral800' },
          bolder: { value: 'DarkNeutral1100' },
        },
      },
    },
    icon: {
      accent: {
        blue: { value: 'Blue500' },
        red: { value: 'Red500' },
        orange: { value: 'Orange500' },
        yellow: { value: 'Yellow500' },
        green: { value: 'Green500' },
        purple: { value: 'Purple500' },
        teal: { value: 'Teal500' },
        magenta: { value: 'Magenta500' },
        lime: { value: 'Lime500' },
        gray: { value: 'DarkNeutral600' },
      },
    },
    border: {
      accent: {
        blue: { value: 'Blue500' },
        red: { value: 'Red500' },
        orange: { value: 'Orange500' },
        yellow: { value: 'Yellow500' },
        green: { value: 'Green500' },
        purple: { value: 'Purple500' },
        teal: { value: 'Teal500' },
        magenta: { value: 'Magenta500' },
        lime: { value: 'Lime500' },
        gray: { value: 'DarkNeutral600' },
      },
    },
    background: {
      accent: {
        blue: {
          subtlest: { value: 'Blue1000' },
          subtler: { value: 'Blue900' },
          subtle: { value: 'Blue800' },
          bolder: { value: 'Blue400' },
        },
        red: {
          subtlest: { value: 'Red1000' },
          subtler: { value: 'Red900' },
          subtle: { value: 'Red800' },
          bolder: { value: 'Red400' },
        },
        orange: {
          subtlest: { value: 'Orange1000' },
          subtler: { value: 'Orange900' },
          subtle: { value: 'Orange800' },
          bolder: { value: 'Orange400' },
        },
        yellow: {
          subtlest: { value: 'Yellow1000' },
          subtler: { value: 'Yellow900' },
          subtle: { value: 'Yellow800' },
          bolder: { value: 'Yellow400' },
        },
        green: {
          subtlest: { value: 'Green1000' },
          subtler: { value: 'Green900' },
          subtle: { value: 'Green800' },
          bolder: { value: 'Green400' },
        },
        purple: {
          subtlest: { value: 'Purple1000' },
          subtler: { value: 'Purple900' },
          subtle: { value: 'Purple800' },
          bolder: { value: 'Purple400' },
        },
        teal: {
          subtlest: { value: 'Teal1000' },
          subtler: { value: 'Teal900' },
          subtle: { value: 'Teal800' },
          bolder: { value: 'Teal400' },
        },
        magenta: {
          subtlest: { value: 'Magenta1000' },
          subtler: { value: 'Magenta900' },
          subtle: { value: 'Magenta800' },
          bolder: { value: 'Magenta400' },
        },
        lime: {
          subtlest: { value: 'Lime1000' },
          subtler: { value: 'Lime900' },
          subtle: { value: 'Lime800' },
          bolder: { value: 'Lime400' },
        },
        gray: {
          subtlest: { value: 'DarkNeutral300' },
          subtler: { value: 'DarkNeutral400' },
          subtle: { value: 'DarkNeutral500' },
          bolder: { value: 'DarkNeutral700' },
        },
      },
    },
  },
};

export default color;
