import type { AccentColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<AccentColorTokenSchema> = {
  color: {
    text: {
      accent: {
        blue: { value: 'B800' },
        red: { value: 'R800' },
        orange: { value: 'O800' },
        yellow: { value: 'Y800' },
        green: { value: 'G800' },
        purple: { value: 'P800' },
        teal: { value: 'T800' },
        magenta: { value: 'M800' },
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
          '[default]': { value: 'B200' },
          bold: { value: 'B400' },
        },
        red: {
          '[default]': { value: 'R200' },
          bold: { value: 'R400' },
        },
        orange: {
          '[default]': { value: 'O200' },
          bold: { value: 'O400' },
        },
        yellow: {
          '[default]': { value: 'Y200' },
          bold: { value: 'Y400' },
        },
        green: {
          '[default]': { value: 'G200' },
          bold: { value: 'G400' },
        },
        purple: {
          '[default]': { value: 'P200' },
          bold: { value: 'P400' },
        },
        teal: {
          '[default]': { value: 'T200' },
          bold: { value: 'T400' },
        },
        magenta: {
          '[default]': { value: 'M200' },
          bold: { value: 'M400' },
        },
      },
    },
  },
};

export default color;
