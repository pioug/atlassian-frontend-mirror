import type { BaseToken } from '../../../palettes/legacy-palette';
import type { BackgroundColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<BackgroundColorTokenSchema<BaseToken>> = {
  color: {
    blanket: {
      '[default]': { value: 'DN90A' },
      // @ts-ignore temporary value (B600 8% opacity)
      selected: { value: '#1D7AFC14' },
      // @ts-ignore temporary value (R600 8% opacity)
      danger: { value: '#E3493514' },
    },
    background: {
      disabled: { value: 'DN70' },
      inverse: {
        subtle: {
          // @ts-ignore temporary value (#FFFFFF 16% opacity)
          '[default]': { value: '#FFFFFF29' },
          // @ts-ignore temporary value (#FFFFFF 24% opacity)
          hovered: { value: '#FFFFFF3D' },
          // @ts-ignore temporary value (#FFFFFF 32% opacity)
          pressed: { value: '#FFFFFF52' },
        },
      },
      input: {
        '[default]': { value: 'DN10' },
        hovered: { value: 'DN30' },
        pressed: { value: 'DN0' },
      },
      neutral: {
        '[default]': {
          '[default]': { value: 'DN70' },
          hovered: { value: 'DN60' },
          pressed: { value: 'B75' },
        },
        subtle: {
          //@ts-ignore temporary value
          '[default]': { value: 'transparent' },
          hovered: { value: 'DN60' },
          pressed: { value: 'B75' },
        },
        bold: {
          '[default]': { value: 'DN700' },
          hovered: { value: 'DN600' },
          pressed: { value: 'DN800' },
        },
      },
      brand: {
        bold: {
          '[default]': { value: 'B400' },
          hovered: { value: 'B300' },
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
          hovered: { value: 'B300' },
          pressed: { value: 'B500' },
        },
      },
      danger: {
        '[default]': {
          '[default]': { value: 'R50' },
          hovered: { value: 'R75' },
          pressed: { value: 'R100' },
        },
        bold: {
          '[default]': { value: 'R300' },
          hovered: { value: 'R200' },
          pressed: { value: 'R400' },
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
          hovered: { value: 'G300' },
          pressed: { value: 'G500' },
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
          hovered: { value: 'P300' },
          pressed: { value: 'P500' },
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
          hovered: { value: 'B300' },
          pressed: { value: 'B500' },
        },
      },
    },
  },
};

export default color;
