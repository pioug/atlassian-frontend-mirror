import type { BaseToken } from '../../../palettes/palette';
import type { DeprecatedTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<DeprecatedTokenSchema<BaseToken>> = {
  color: {
    accent: {
      boldBlue: { value: 'Blue400' },
      boldGreen: { value: 'Green400' },
      boldOrange: { value: 'Orange400' },
      boldPurple: { value: 'Purple400' },
      boldRed: { value: 'Red400' },
      boldTeal: { value: 'Teal400' },
      subtleBlue: { value: 'Blue200' },
      subtleGreen: { value: 'Green200' },
      subtleMagenta: { value: 'Magenta200' },
      subtleOrange: { value: 'Orange200' },
      subtlePurple: { value: 'Purple200' },
      subtleRed: { value: 'Red200' },
      subtleTeal: { value: 'Teal200' },
    },
    background: {
      accent: {
        blue: {
          '[default]': { value: 'Blue200' },
          bold: { value: 'Blue400' },
        },
        red: {
          '[default]': { value: 'Red200' },
          bold: { value: 'Red400' },
        },
        orange: {
          '[default]': { value: 'Orange200' },
          bold: { value: 'Orange400' },
        },
        yellow: {
          '[default]': { value: 'Yellow200' },
          bold: { value: 'Yellow400' },
        },
        green: {
          '[default]': { value: 'Green200' },
          bold: { value: 'Green400' },
        },
        purple: {
          '[default]': { value: 'Purple200' },
          bold: { value: 'Purple400' },
        },
        teal: {
          '[default]': { value: 'Teal200' },
          bold: { value: 'Teal400' },
        },
        magenta: {
          '[default]': { value: 'Magenta200' },
          bold: { value: 'Magenta400' },
        },
      },
      blanket: { value: 'Neutral500A' },
      brand: {
        '[default]': {
          '[default]': { value: 'Blue100' },
          hovered: { value: 'Blue200' },
          pressed: { value: 'Blue300' },
        },
      },
      boldBrand: {
        resting: { value: 'Blue700' },
        hover: { value: 'Blue800' },
        pressed: { value: 'Blue900' },
      },
      boldDanger: {
        resting: { value: 'Red700' },
        hover: { value: 'Red800' },
        pressed: { value: 'Red900' },
      },
      boldDiscovery: {
        resting: { value: 'Purple700' },
        hover: { value: 'Purple800' },
        pressed: { value: 'Purple900' },
      },
      boldNeutral: {
        resting: { value: 'Neutral800' },
        hover: { value: 'Neutral900' },
        pressed: { value: 'Neutral1000' },
      },
      boldSuccess: {
        resting: { value: 'Green700' },
        hover: { value: 'Green800' },
        pressed: { value: 'Green900' },
      },
      boldWarning: {
        resting: { value: 'Yellow400' },
        hover: { value: 'Yellow500' },
        pressed: { value: 'Yellow600' },
      },
      default: { value: 'Neutral0' },
      card: { value: 'Neutral0' },
      inverse: {
        // @ts-ignore temporary until a palette colour exists for it
        '[default]': { value: '#FFFFFF29' },
      },
      overlay: { value: 'Neutral0' },
      selected: {
        resting: { value: 'Blue100' },
        hover: { value: 'Blue200' },
      },
      subtleBorderedNeutral: {
        resting: { value: 'Neutral100A' },
        pressed: { value: 'Neutral200A' },
      },
      subtleBrand: {
        resting: { value: 'Blue100' },
        hover: { value: 'Blue200' },
        pressed: { value: 'Blue300' },
      },
      subtleDanger: {
        resting: { value: 'Red100' },
        hover: { value: 'Red200' },
        pressed: { value: 'Red300' },
      },
      subtleDiscovery: {
        resting: { value: 'Purple100' },
        hover: { value: 'Purple200' },
        pressed: { value: 'Purple300' },
      },
      subtleNeutral: {
        resting: { value: 'Neutral200A' },
        hover: { value: 'Neutral300A' },
        pressed: { value: 'Neutral400A' },
      },
      subtleSuccess: {
        resting: { value: 'Green100' },
        hover: { value: 'Green200' },
        pressed: { value: 'Green300' },
      },
      subtleWarning: {
        resting: { value: 'Yellow100' },
        hover: { value: 'Yellow200' },
        pressed: { value: 'Yellow300' },
      },
      sunken: { value: 'Neutral100A' },
      transparentNeutral: {
        hover: { value: 'Neutral200A' },
        pressed: { value: 'Neutral300A' },
      },
    },
    text: {
      highEmphasis: { value: 'Neutral1000' },
      mediumEmphasis: { value: 'Neutral800' },
      lowEmphasis: { value: 'Neutral700' },
      link: {
        resting: { value: 'Blue700' },
        pressed: { value: 'Blue800' },
      },
      onBold: { value: 'Neutral0' },
      onBoldWarning: { value: 'Neutral1000' },
    },
    border: {
      focus: { value: 'Blue500' },
      neutral: { value: 'Neutral300A' },
    },
    iconBorder: {
      brand: { value: 'Blue600' },
      danger: { value: 'Red600' },
      warning: { value: 'Orange600' },
      success: { value: 'Green600' },
      discovery: { value: 'Purple600' },
    },
    overlay: {
      hover: { value: 'Neutral400A' },
      pressed: { value: 'Neutral500A' },
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
          color: 'Neutral1100',
          opacity: 0.25,
        },
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'Neutral1100',
          opacity: 0.31,
        },
      ],
    },
    overlay: {
      value: [
        {
          radius: 12,
          offset: { x: 0, y: 8 },
          color: 'Neutral1100',
          opacity: 0.15,
        },
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'Neutral1100',
          opacity: 0.31,
        },
      ],
    },
  },
};

export default color;
