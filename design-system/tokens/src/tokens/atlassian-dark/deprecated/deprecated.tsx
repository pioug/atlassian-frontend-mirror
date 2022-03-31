import type { DeprecatedTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<DeprecatedTokenSchema> = {
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
      blanket: { value: 'DN-100A' },
      brand: {
        '[default]': {
          '[default]': { value: 'B1000' },
          hovered: { value: 'B900' },
          pressed: { value: 'B800' },
        },
      },
      boldBrand: {
        resting: { value: 'B400' },
        hover: { value: 'B300' },
        pressed: { value: 'B200' },
      },
      boldDanger: {
        resting: { value: 'R400' },
        hover: { value: 'R300' },
        pressed: { value: 'R200' },
      },
      boldDiscovery: {
        resting: { value: 'P400' },
        hover: { value: 'P300' },
        pressed: { value: 'P200' },
      },
      boldNeutral: {
        resting: { value: 'DN800' },
        hover: { value: 'DN900' },
        pressed: { value: 'DN1000' },
      },
      boldSuccess: {
        resting: { value: 'G400' },
        hover: { value: 'G300' },
        pressed: { value: 'G200' },
      },
      boldWarning: {
        resting: { value: 'Y400' },
        hover: { value: 'Y300' },
        pressed: { value: 'Y200' },
      },
      default: { value: 'DN0' },
      card: { value: 'DN100' },
      inverse: {
        // @ts-ignore temporary until a palette colour exists for it
        '[default]': { value: '#00000029' },
      },
      overlay: { value: 'DN200' },
      selected: {
        resting: { value: 'DN200A' },
        hover: { value: 'DN300A' },
      },
      subtleBorderedNeutral: {
        resting: { value: 'DN100A' },
        pressed: { value: 'DN200A' },
      },
      subtleBrand: {
        resting: { value: 'B1000' },
        hover: { value: 'B900' },
        pressed: { value: 'B800' },
      },
      subtleDanger: {
        resting: { value: 'R1000' },
        hover: { value: 'R900' },
        pressed: { value: 'R800' },
      },
      subtleDiscovery: {
        resting: { value: 'P1000' },
        hover: { value: 'P900' },
        pressed: { value: 'P800' },
      },
      subtleNeutral: {
        resting: { value: 'DN200A' },
        hover: { value: 'DN300A' },
        pressed: { value: 'DN400A' },
      },
      subtleSuccess: {
        resting: { value: 'G1000' },
        hover: { value: 'G900' },
        pressed: { value: 'G800' },
      },
      subtleWarning: {
        resting: { value: 'Y1000' },
        hover: { value: 'Y900' },
        pressed: { value: 'Y800' },
      },
      sunken: { value: 'DN-100A' },
      transparentNeutral: {
        hover: { value: 'DN200A' },
        pressed: { value: 'DN300A' },
      },
    },
    text: {
      highEmphasis: { value: 'DN1000' },
      mediumEmphasis: { value: 'DN800' },
      lowEmphasis: { value: 'DN700' },
      link: {
        resting: { value: 'B400' },
        pressed: { value: 'B300' },
      },
      onBold: { value: 'DN0' },
      onBoldWarning: { value: 'DN0' },
    },
    border: {
      focus: { value: 'B300' },
      neutral: { value: 'DN300A' },
    },
    iconBorder: {
      brand: { value: 'B500' },
      danger: { value: 'R500' },
      warning: { value: 'Y500' },
      success: { value: 'G500' },
      discovery: { value: 'P500' },
    },
    overlay: {
      hover: { value: 'DN400A' },
      pressed: { value: 'DN500A' },
    },
  },
  shadow: {
    card: {
      value: [
        {
          radius: 1,
          offset: { x: 0, y: 1 },
          color: 'DN-100A',
          // This opacity overrides the color alpha.
          opacity: 0.5,
        },
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'DN-100A',
          // This opacity overrides the color alpha.
          opacity: 0.5,
        },
      ],
    },
    overlay: {
      value: [
        {
          radius: 0,
          spread: 1,
          color: 'DN100A',
          offset: { x: 0, y: 0 },
          opacity: 0.04,
          inset: true,
        },
        {
          radius: 12,
          offset: { x: 0, y: 8 },
          color: 'DN-100A',
          // This opacity overrides the color alpha.
          opacity: 0.36,
        },
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'DN-100A',
          // This opacity overrides the color alpha.
          opacity: 0.5,
        },
      ],
    },
  },
};

export default color;
