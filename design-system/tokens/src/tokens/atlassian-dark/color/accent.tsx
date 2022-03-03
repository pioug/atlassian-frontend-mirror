import type { AccentColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<AccentColorTokenSchema> = {
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
          '[default]': { value: 'O300' },
          bolder: { value: 'O200' },
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
          '[default]': { value: 'M300' },
          bolder: { value: 'M200' },
        },
      },
    },
    icon: {
      accent: {
        blue: { value: 'B500' },
        red: { value: 'R500' },
        orange: { value: 'O500' },
        yellow: { value: 'Y500' },
        green: { value: 'G500' },
        purple: { value: 'P500' },
        teal: { value: 'T500' },
        magenta: { value: 'M500' },
      },
    },
    border: {
      accent: {
        blue: { value: 'B500' },
        red: { value: 'R500' },
        orange: { value: 'O500' },
        yellow: { value: 'Y500' },
        green: { value: 'G500' },
        purple: { value: 'P500' },
        teal: { value: 'T500' },
        magenta: { value: 'M500' },
      },
    },
    background: {
      accent: {
        blue: {
          subtlest: { value: 'B1000' },
          subtler: { value: 'B900' },
          subtle: { value: 'B800' },
          bolder: { value: 'B400' },
        },
        red: {
          subtlest: { value: 'R1000' },
          subtler: { value: 'R900' },
          subtle: { value: 'R800' },
          bolder: { value: 'R400' },
        },
        orange: {
          subtlest: { value: 'O1000' },
          subtler: { value: 'O900' },
          subtle: { value: 'O800' },
          bolder: { value: 'O400' },
        },
        yellow: {
          subtlest: { value: 'Y1000' },
          subtler: { value: 'Y900' },
          subtle: { value: 'Y800' },
          bolder: { value: 'Y400' },
        },
        green: {
          subtlest: { value: 'G1000' },
          subtler: { value: 'G900' },
          subtle: { value: 'G800' },
          bolder: { value: 'G400' },
        },
        purple: {
          subtlest: { value: 'P1000' },
          subtler: { value: 'P900' },
          subtle: { value: 'P800' },
          bolder: { value: 'P400' },
        },
        teal: {
          subtlest: { value: 'T1000' },
          subtler: { value: 'T900' },
          subtle: { value: 'T800' },
          bolder: { value: 'T400' },
        },
        magenta: {
          subtlest: { value: 'M1000' },
          subtler: { value: 'M900' },
          subtle: { value: 'M800' },
          bolder: { value: 'M400' },
        },
      },
    },
  },
};

export default color;
