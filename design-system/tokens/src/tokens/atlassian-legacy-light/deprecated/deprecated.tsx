import type { BaseToken } from '../../../palettes/legacy-palette';
import type { DeprecatedTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<DeprecatedTokenSchema<BaseToken>> = {
  color: {
    accent: {
      // @ts-expect-error deprecated tokens should not be in use
      boldBlue: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      boldGreen: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      boldOrange: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      boldPurple: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      boldRed: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      boldTeal: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      subtleBlue: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      subtleGreen: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      subtleMagenta: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      subtleOrange: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      subtlePurple: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      subtleRed: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      subtleTeal: { value: '#FA11F2' },
    },
    background: {
      accent: {
        blue: {
          // @ts-expect-error deprecated tokens should not be in use
          '[default]': { value: '#FA11F2' },
          // @ts-expect-error deprecated tokens should not be in use
          bold: { value: '#FA11F2' },
        },
        red: {
          // @ts-expect-error deprecated tokens should not be in use
          '[default]': { value: '#FA11F2' },
          // @ts-expect-error deprecated tokens should not be in use
          bold: { value: '#FA11F2' },
        },
        orange: {
          // @ts-expect-error deprecated tokens should not be in use
          '[default]': { value: '#FA11F2' },
          // @ts-expect-error deprecated tokens should not be in use
          bold: { value: '#FA11F2' },
        },
        yellow: {
          // @ts-expect-error deprecated tokens should not be in use
          '[default]': { value: '#FA11F2' },
          // @ts-expect-error deprecated tokens should not be in use
          bold: { value: '#FA11F2' },
        },
        green: {
          // @ts-expect-error deprecated tokens should not be in use
          '[default]': { value: '#FA11F2' },
          // @ts-expect-error deprecated tokens should not be in use
          bold: { value: '#FA11F2' },
        },
        purple: {
          // @ts-expect-error deprecated tokens should not be in use
          '[default]': { value: '#FA11F2' },
          // @ts-expect-error deprecated tokens should not be in use
          bold: { value: '#FA11F2' },
        },
        teal: {
          // @ts-expect-error deprecated tokens should not be in use
          '[default]': { value: '#FA11F2' },
          // @ts-expect-error deprecated tokens should not be in use
          bold: { value: '#FA11F2' },
        },
        magenta: {
          // @ts-expect-error deprecated tokens should not be in use
          '[default]': { value: '#FA11F2' },
          // @ts-expect-error deprecated tokens should not be in use
          bold: { value: '#FA11F2' },
        },
      },
      // @ts-expect-error deprecated tokens should not be in use
      blanket: { value: '#FA11F2' },
      brand: {
        '[default]': {
          // @ts-expect-error deprecated tokens should not be in use
          '[default]': { value: '#FA11F2' },
          // @ts-expect-error deprecated tokens should not be in use
          hovered: { value: '#FA11F2' },
          // @ts-expect-error deprecated tokens should not be in use
          pressed: { value: '#FA11F2' },
        },
      },
      boldBrand: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        hover: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
      boldDanger: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        hover: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
      boldDiscovery: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        hover: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
      boldNeutral: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        hover: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
      boldSuccess: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        hover: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
      boldWarning: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        hover: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
      // @ts-expect-error deprecated tokens should not be in use
      default: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      card: { value: '#FA11F2' },
      inverse: {
        // @ts-ignore temporary until a palette colour exists for it
        // @ts-expect-error deprecated tokens should not be in use
        '[default]': { value: '#FA11F2FFFFFF29' },
      },
      // @ts-expect-error deprecated tokens should not be in use
      overlay: { value: '#FA11F2' },
      selected: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        hover: { value: '#FA11F2' },
      },
      subtleBorderedNeutral: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
      subtleBrand: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        hover: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
      subtleDanger: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        hover: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
      subtleDiscovery: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        hover: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
      subtleNeutral: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        hover: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
      subtleSuccess: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        hover: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
      subtleWarning: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        hover: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
      // @ts-expect-error deprecated tokens should not be in use
      sunken: { value: '#FA11F2' },
      transparentNeutral: {
        // @ts-expect-error deprecated tokens should not be in use
        hover: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
    },
    text: {
      // @ts-expect-error deprecated tokens should not be in use
      highEmphasis: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      mediumEmphasis: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      lowEmphasis: { value: '#FA11F2' },
      link: {
        // @ts-expect-error deprecated tokens should not be in use
        resting: { value: '#FA11F2' },
        // @ts-expect-error deprecated tokens should not be in use
        pressed: { value: '#FA11F2' },
      },
      // @ts-expect-error deprecated tokens should not be in use
      onBold: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      onBoldWarning: { value: '#FA11F2' },
    },
    border: {
      // @ts-expect-error deprecated tokens should not be in use
      focus: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      neutral: { value: '#FA11F2' },
    },
    iconBorder: {
      // @ts-expect-error deprecated tokens should not be in use
      brand: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      danger: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      warning: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      success: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      discovery: { value: '#FA11F2' },
    },
    overlay: {
      // @ts-expect-error deprecated tokens should not be in use
      hover: { value: '#FA11F2' },
      // @ts-expect-error deprecated tokens should not be in use
      pressed: { value: '#FA11F2' },
    },
    interaction: {
      inverse: {
        hovered: {
          // @ts-ignore temporary values
          // @ts-expect-error deprecated tokens should not be in use
          value: '#FA11F2',
        },
        pressed: {
          // @ts-ignore temporary values
          // @ts-expect-error deprecated tokens should not be in use
          value: '#FA11F2',
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
          // @ts-expect-error deprecated tokens should not be in use
          color: '#FA11F2',
          opacity: 0.25,
        },
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          // @ts-expect-error deprecated tokens should not be in use
          color: '#FA11F2',
          opacity: 0.31,
        },
      ],
    },
    overlay: {
      value: [
        {
          radius: 12,
          offset: { x: 0, y: 8 },
          // @ts-expect-error deprecated tokens should not be in use
          color: '#FA11F2',
          opacity: 0.15,
        },
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          // @ts-expect-error deprecated tokens should not be in use
          color: '#FA11F2',
          opacity: 0.31,
        },
      ],
    },
  },
};

export default color;
