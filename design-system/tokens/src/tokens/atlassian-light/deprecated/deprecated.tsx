import type { DeprecatedTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<DeprecatedTokenSchema> = {
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
      blanket: { value: 'N500A' },
      brand: {
        '[default]': {
          '[default]': { value: 'B100' },
          hovered: { value: 'B200' },
          pressed: { value: 'B300' },
        },
      },
      boldBrand: {
        resting: { value: 'B700' },
        hover: { value: 'B800' },
        pressed: { value: 'B900' },
      },
      boldDanger: {
        resting: { value: 'R700' },
        hover: { value: 'R800' },
        pressed: { value: 'R900' },
      },
      boldDiscovery: {
        resting: { value: 'P700' },
        hover: { value: 'P800' },
        pressed: { value: 'P900' },
      },
      boldNeutral: {
        resting: { value: 'N800' },
        hover: { value: 'N900' },
        pressed: { value: 'N1000' },
      },
      boldSuccess: {
        resting: { value: 'G700' },
        hover: { value: 'G800' },
        pressed: { value: 'G900' },
      },
      boldWarning: {
        resting: { value: 'Y400' },
        hover: { value: 'Y500' },
        pressed: { value: 'Y600' },
      },
      default: { value: 'N0' },
      card: { value: 'N0' },
      inverse: {
        // @ts-ignore temporary until a palette colour exists for it
        '[default]': { value: '#FFFFFF29' },
      },
      overlay: { value: 'N0' },
      selected: {
        resting: { value: 'B100' },
        hover: { value: 'B200' },
      },
      subtleBorderedNeutral: {
        resting: { value: 'N100A' },
        pressed: { value: 'N200A' },
      },
      subtleBrand: {
        resting: { value: 'B100' },
        hover: { value: 'B200' },
        pressed: { value: 'B300' },
      },
      subtleDanger: {
        resting: { value: 'R100' },
        hover: { value: 'R200' },
        pressed: { value: 'R300' },
      },
      subtleDiscovery: {
        resting: { value: 'P100' },
        hover: { value: 'P200' },
        pressed: { value: 'P300' },
      },
      subtleNeutral: {
        resting: { value: 'N200A' },
        hover: { value: 'N300A' },
        pressed: { value: 'N400A' },
      },
      subtleSuccess: {
        resting: { value: 'G100' },
        hover: { value: 'G200' },
        pressed: { value: 'G300' },
      },
      subtleWarning: {
        resting: { value: 'Y100' },
        hover: { value: 'Y200' },
        pressed: { value: 'Y300' },
      },
      sunken: { value: 'N100A' },
      transparentNeutral: {
        hover: { value: 'N200A' },
        pressed: { value: 'N300A' },
      },
    },
    text: {
      highEmphasis: { value: 'N1000' },
      mediumEmphasis: { value: 'N800' },
      lowEmphasis: { value: 'N700' },
      link: {
        resting: { value: 'B700' },
        pressed: { value: 'B800' },
      },
      onBold: { value: 'N0' },
      onBoldWarning: { value: 'N1000' },
    },
    border: {
      focus: { value: 'B500' },
      neutral: { value: 'N300A' },
    },
    iconBorder: {
      brand: { value: 'B600' },
      danger: { value: 'R600' },
      warning: { value: 'O600' },
      success: { value: 'G600' },
      discovery: { value: 'P600' },
    },
    overlay: {
      hover: { value: 'N400A' },
      pressed: { value: 'N500A' },
    },
    interaction: {
      inverse: {
        hovered: {
          // @ts-ignore temporary values
          value: '#00000029',
        },
        pressed: {
          // @ts-ignore temporary values
          value: '#00000052',
        },
      },
    },
  },
  shadow: {
    card: {
      value: [
        {
          radius: 1,
          offset: { x: 0, y: 1 },
          color: 'N1100',
          opacity: 0.25,
        },
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'N1100',
          opacity: 0.31,
        },
      ],
    },
    overlay: {
      value: [
        {
          radius: 12,
          offset: { x: 0, y: 8 },
          color: 'N1100',
          opacity: 0.15,
        },
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'N1100',
          opacity: 0.31,
        },
      ],
    },
  },
};

export default color;
