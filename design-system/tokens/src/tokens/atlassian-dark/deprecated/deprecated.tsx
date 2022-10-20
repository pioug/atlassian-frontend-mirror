import type { BaseToken } from '../../../palettes/palette';
import type { DeprecatedTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<DeprecatedTokenSchema<BaseToken>> = {
  color: {
    accent: {
      boldBlue: { value: 'Blue700' },
      boldGreen: { value: 'Green700' },
      boldOrange: { value: 'Orange700' },
      boldPurple: { value: 'Purple700' },
      boldRed: { value: 'Red700' },
      boldTeal: { value: 'Teal700' },
      subtleBlue: { value: 'Blue900' },
      subtleGreen: { value: 'Green900' },
      subtleMagenta: { value: 'Magenta900' },
      subtleOrange: { value: 'Orange900' },
      subtlePurple: { value: 'Purple900' },
      subtleRed: { value: 'Red900' },
      subtleTeal: { value: 'Teal900' },
    },
    background: {
      accent: {
        blue: {
          '[default]': { value: 'Blue900' },
          bold: { value: 'Blue700' },
        },
        red: {
          '[default]': { value: 'Red900' },
          bold: { value: 'Red700' },
        },
        orange: {
          '[default]': { value: 'Orange900' },
          bold: { value: 'Orange700' },
        },
        yellow: {
          '[default]': { value: 'Yellow900' },
          bold: { value: 'Yellow700' },
        },
        green: {
          '[default]': { value: 'Green900' },
          bold: { value: 'Green700' },
        },
        purple: {
          '[default]': { value: 'Purple900' },
          bold: { value: 'Purple700' },
        },
        teal: {
          '[default]': { value: 'Teal900' },
          bold: { value: 'Teal700' },
        },
        magenta: {
          '[default]': { value: 'Magenta900' },
          bold: { value: 'Magenta700' },
        },
      },
      blanket: { value: 'DarkNeutral-100A' },
      brand: {
        '[default]': {
          '[default]': { value: 'Blue1000' },
          hovered: { value: 'Blue900' },
          pressed: { value: 'Blue800' },
        },
      },
      boldBrand: {
        resting: { value: 'Blue400' },
        hover: { value: 'Blue300' },
        pressed: { value: 'Blue200' },
      },
      boldDanger: {
        resting: { value: 'Red400' },
        hover: { value: 'Red300' },
        pressed: { value: 'Red200' },
      },
      boldDiscovery: {
        resting: { value: 'Purple400' },
        hover: { value: 'Purple300' },
        pressed: { value: 'Purple200' },
      },
      boldNeutral: {
        resting: { value: 'DarkNeutral800' },
        hover: { value: 'DarkNeutral900' },
        pressed: { value: 'DarkNeutral1000' },
      },
      boldSuccess: {
        resting: { value: 'Green400' },
        hover: { value: 'Green300' },
        pressed: { value: 'Green200' },
      },
      boldWarning: {
        resting: { value: 'Yellow400' },
        hover: { value: 'Yellow300' },
        pressed: { value: 'Yellow200' },
      },
      default: { value: 'DarkNeutral0' },
      card: { value: 'DarkNeutral100' },
      inverse: {
        // @ts-ignore temporary until a palette colour exists for it
        '[default]': { value: '#00000029' },
      },
      overlay: { value: 'DarkNeutral200' },
      selected: {
        resting: { value: 'DarkNeutral200A' },
        hover: { value: 'DarkNeutral300A' },
      },
      subtleBorderedNeutral: {
        resting: { value: 'DarkNeutral100A' },
        pressed: { value: 'DarkNeutral200A' },
      },
      subtleBrand: {
        resting: { value: 'Blue1000' },
        hover: { value: 'Blue900' },
        pressed: { value: 'Blue800' },
      },
      subtleDanger: {
        resting: { value: 'Red1000' },
        hover: { value: 'Red900' },
        pressed: { value: 'Red800' },
      },
      subtleDiscovery: {
        resting: { value: 'Purple1000' },
        hover: { value: 'Purple900' },
        pressed: { value: 'Purple800' },
      },
      subtleNeutral: {
        resting: { value: 'DarkNeutral200A' },
        hover: { value: 'DarkNeutral300A' },
        pressed: { value: 'DarkNeutral400A' },
      },
      subtleSuccess: {
        resting: { value: 'Green1000' },
        hover: { value: 'Green900' },
        pressed: { value: 'Green800' },
      },
      subtleWarning: {
        resting: { value: 'Yellow1000' },
        hover: { value: 'Yellow900' },
        pressed: { value: 'Yellow800' },
      },
      sunken: { value: 'DarkNeutral-100A' },
      transparentNeutral: {
        hover: { value: 'DarkNeutral200A' },
        pressed: { value: 'DarkNeutral300A' },
      },
    },
    text: {
      highEmphasis: { value: 'DarkNeutral1000' },
      mediumEmphasis: { value: 'DarkNeutral800' },
      lowEmphasis: { value: 'DarkNeutral700' },
      link: {
        resting: { value: 'Blue400' },
        pressed: { value: 'Blue300' },
      },
      onBold: { value: 'DarkNeutral0' },
      onBoldWarning: { value: 'DarkNeutral0' },
    },
    border: {
      focus: { value: 'Blue300' },
      neutral: { value: 'DarkNeutral300A' },
    },
    iconBorder: {
      brand: { value: 'Blue500' },
      danger: { value: 'Red500' },
      warning: { value: 'Yellow500' },
      success: { value: 'Green500' },
      discovery: { value: 'Purple500' },
    },
    overlay: {
      hover: { value: 'DarkNeutral400A' },
      pressed: { value: 'DarkNeutral500A' },
    },
    interaction: {
      inverse: {
        hovered: {
          // @ts-ignore temporary values
          value: '#ffffff33',
        },
        pressed: {
          // @ts-ignore temporary values
          value: '#ffffff5c',
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
          color: 'DarkNeutral-100A',
          // This opacity overrides the color alpha.
          opacity: 0.5,
        },
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'DarkNeutral-100A',
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
          color: 'DarkNeutral100A',
          offset: { x: 0, y: 0 },
          opacity: 0.04,
          inset: true,
        },
        {
          radius: 12,
          offset: { x: 0, y: 8 },
          color: 'DarkNeutral-100A',
          // This opacity overrides the color alpha.
          opacity: 0.36,
        },
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'DarkNeutral-100A',
          // This opacity overrides the color alpha.
          opacity: 0.5,
        },
      ],
    },
  },
};

export default color;
