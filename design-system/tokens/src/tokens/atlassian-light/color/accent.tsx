import type { AccentColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<AccentColorTokenSchema> = {
  color: {
    text: {
      accent: {
        blue: {
          '[default]': { value: 'B800' },
          bolder: { value: 'B900' },
        },
        red: {
          '[default]': { value: 'R800' },
          bolder: { value: 'R900' },
        },
        orange: {
          '[default]': { value: 'O800' },
          bolder: { value: 'O900' },
        },
        yellow: {
          '[default]': { value: 'Y800' },
          bolder: { value: 'Y900' },
        },
        green: {
          '[default]': { value: 'G800' },
          bolder: { value: 'G900' },
        },
        purple: {
          '[default]': { value: 'P800' },
          bolder: { value: 'P900' },
        },
        teal: {
          '[default]': { value: 'T800' },
          bolder: { value: 'T900' },
        },
        magenta: {
          '[default]': { value: 'M800' },
          bolder: { value: 'M900' },
        },
      },
    },
    icon: {
      accent: {
        blue: { value: 'B600' },
        red: { value: 'R600' },
        orange: { value: 'O600' },
        yellow: { value: 'Y600' },
        green: { value: 'G600' },
        purple: { value: 'P600' },
        teal: { value: 'T600' },
        magenta: { value: 'M600' },
      },
    },
    border: {
      accent: {
        blue: { value: 'B600' },
        red: { value: 'R600' },
        orange: { value: 'O600' },
        yellow: { value: 'Y600' },
        green: { value: 'G600' },
        purple: { value: 'P600' },
        teal: { value: 'T600' },
        magenta: { value: 'M600' },
      },
    },
    background: {
      accent: {
        blue: {
          subtlest: { value: 'B100' },
          subtler: { value: 'B200' },
          subtle: { value: 'B400' },
          bolder: { value: 'B700' },
        },
        red: {
          subtlest: { value: 'R100' },
          subtler: { value: 'R200' },
          subtle: { value: 'R400' },
          bolder: { value: 'R700' },
        },
        orange: {
          subtlest: { value: 'O100' },
          subtler: { value: 'O200' },
          subtle: { value: 'O400' },
          bolder: { value: 'O700' },
        },
        yellow: {
          subtlest: { value: 'Y100' },
          subtler: { value: 'Y200' },
          subtle: { value: 'Y400' },
          bolder: { value: 'Y700' },
        },
        green: {
          subtlest: { value: 'G100' },
          subtler: { value: 'G200' },
          subtle: { value: 'G400' },
          bolder: { value: 'G700' },
        },
        purple: {
          subtlest: { value: 'P100' },
          subtler: { value: 'P200' },
          subtle: { value: 'P400' },
          bolder: { value: 'P700' },
        },
        teal: {
          subtlest: { value: 'T100' },
          subtler: { value: 'T200' },
          subtle: { value: 'T400' },
          bolder: { value: 'T700' },
        },
        magenta: {
          subtlest: { value: 'M100' },
          subtler: { value: 'M200' },
          subtle: { value: 'M400' },
          bolder: { value: 'M700' },
        },
      },
    },
  },
};

export default color;
