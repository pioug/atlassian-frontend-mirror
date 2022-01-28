import type { AccentColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<AccentColorTokenSchema> = {
  color: {
    text: {
      accent: {
        blue: { value: 'B300' },
        red: { value: 'R300' },
        orange: { value: 'O300' },
        yellow: { value: 'Y300' },
        green: { value: 'G300' },
        purple: { value: 'P300' },
        teal: { value: 'T300' },
        magenta: { value: 'M300' },
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
          '[default]': { value: 'B900' },
          bold: { value: 'B700' },
        },
        red: {
          '[default]': { value: 'R900' },
          bold: { value: 'R700' },
        },
        orange: {
          '[default]': { value: 'O900' },
          bold: { value: 'O700' },
        },
        yellow: {
          '[default]': { value: 'Y900' },
          bold: { value: 'Y700' },
        },
        green: {
          '[default]': { value: 'G900' },
          bold: { value: 'G700' },
        },
        purple: {
          '[default]': { value: 'P900' },
          bold: { value: 'P700' },
        },
        teal: {
          '[default]': { value: 'T900' },
          bold: { value: 'T700' },
        },
        magenta: {
          '[default]': { value: 'M900' },
          bold: { value: 'M700' },
        },
      },
    },
  },
};

export default color;
