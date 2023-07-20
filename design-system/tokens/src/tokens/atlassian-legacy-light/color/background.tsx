import type { BaseToken } from '../../../palettes/legacy-palette';
import type { BackgroundColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<BackgroundColorTokenSchema<BaseToken>> = {
  color: {
    blanket: {
      '[default]': { value: 'N100A' },
      // @ts-ignore temporary value (Blue500 8% opacity)
      selected: { value: '#388BFF14' },
      // @ts-ignore temporary value (Red500 8% opacity)
      danger: { value: '#EF5C4814' },
    },
    background: {
      disabled: { value: 'N100A' },
      inverse: {
        subtle: {
          // @ts-ignore temporary value (#000000 16% opacity)
          '[default]': { value: '#00000029' },
          // @ts-ignore temporary value (#000000 24% opacity)
          hovered: { value: '#0000003D' },
          // @ts-ignore temporary value (#000000 32% opacity)
          pressed: { value: '#00000052' },
        },
      },
      input: {
        '[default]': { value: 'N10' },
        hovered: { value: 'N30' },
        pressed: { value: 'N0' },
      },
      neutral: {
        '[default]': {
          // this SHOULD be N20A but it creates a larger visual difference with lozenge / badge
          '[default]': { value: 'N40' },
          hovered: { value: 'N30A' },
          pressed: { value: 'B75' },
        },
        subtle: {
          '[default]': { value: 'transparent' },
          hovered: { value: 'N30A' },
          pressed: { value: 'B75' },
        },
        bold: {
          '[default]': { value: 'N500' },
          hovered: { value: 'N400' },
          pressed: { value: 'N600' },
        },
      },
      brand: {
        subtlest: {
          '[default]': { value: 'B75' },
          hovered: { value: 'B50' },
          pressed: { value: 'B100' },
        },
        bold: {
          '[default]': { value: 'B400' },
          hovered: { value: 'B300' },
          pressed: { value: 'B500' },
        },
        boldest: {
          '[default]': { value: 'B500' },
          hovered: { value: 'B400' },
          pressed: { value: 'B500' },
        },
      },
      selected: {
        '[default]': {
          '[default]': { value: 'B50' },
          hovered: { value: 'B75' },
          pressed: { value: 'B100' },
        },
        bold: {
          '[default]': { value: 'B400' },
          hovered: { value: 'B200' },
          pressed: { value: 'B400' },
        },
      },
      danger: {
        '[default]': {
          '[default]': { value: 'R50' },
          hovered: { value: 'R75' },
          pressed: { value: 'R100' },
        },
        bold: {
          '[default]': { value: 'R400' },
          hovered: { value: 'R300' },
          pressed: { value: 'R500' },
        },
      },
      warning: {
        '[default]': {
          '[default]': { value: 'Y50' },
          hovered: { value: 'Y75' },
          pressed: { value: 'Y100' },
        },
        bold: {
          '[default]': { value: 'Y300' },
          hovered: { value: 'Y200' },
          pressed: { value: 'Y400' },
        },
      },
      success: {
        '[default]': {
          '[default]': { value: 'G50' },
          hovered: { value: 'G75' },
          pressed: { value: 'G100' },
        },
        bold: {
          '[default]': { value: 'G400' },
          hovered: { value: 'G200' },
          pressed: { value: 'G400' },
        },
      },
      discovery: {
        '[default]': {
          '[default]': { value: 'P50' },
          hovered: { value: 'P75' },
          pressed: { value: 'P100' },
        },
        bold: {
          '[default]': { value: 'P400' },
          hovered: { value: 'P200' },
          pressed: { value: 'P400' },
        },
      },
      information: {
        '[default]': {
          '[default]': { value: 'B50' },
          hovered: { value: 'B75' },
          pressed: { value: 'B100' },
        },
        bold: {
          '[default]': { value: 'B400' },
          hovered: { value: 'B200' },
          pressed: { value: 'B400' },
        },
      },
    },
  },
};

export default color;
