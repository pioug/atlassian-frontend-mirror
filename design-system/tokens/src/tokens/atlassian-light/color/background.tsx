import type { BackgroundColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<BackgroundColorTokenSchema> = {
  color: {
    blanket: {
      '[default]': { value: 'N500A' },
      // @ts-ignore temporary value (B500 8% opacity)
      selected: { value: '#388BFFCC' },
      // @ts-ignore temporary value (R500 8% opacity)
      danger: { value: '#EF5C48CC' },
    },
    background: {
      disabled: { value: 'N200A' },
      // @ts-ignore temporary value
      inverse: { value: '#00000029' },
      input: {
        '[default]': { value: 'N100A' },
        hovered: { value: 'N0' },
        pressed: { value: 'N200A' },
      },
      neutral: {
        '[default]': {
          '[default]': { value: 'N200A' },
          hovered: { value: 'N300A' },
          pressed: { value: 'N400A' },
        },
        subtle: {
          // @ts-ignore temporary value
          '[default]': { value: 'transparent' },
          hovered: { value: 'N200A' },
          pressed: { value: 'N300A' },
        },
        bold: {
          '[default]': { value: 'N800' },
          hovered: { value: 'N900' },
          pressed: { value: 'N1000' },
        },
      },
      brand: {
        bold: {
          '[default]': { value: 'B700' },
          hovered: { value: 'B800' },
          pressed: { value: 'B900' },
        },
      },
      selected: {
        '[default]': {
          '[default]': { value: 'B100' },
          hovered: { value: 'B200' },
          pressed: { value: 'B300' },
        },
        bold: {
          '[default]': { value: 'B700' },
          hovered: { value: 'B800' },
          pressed: { value: 'B900' },
        },
      },
      danger: {
        '[default]': {
          '[default]': { value: 'R100' },
          hovered: { value: 'R200' },
          pressed: { value: 'R300' },
        },
        bold: {
          '[default]': { value: 'R700' },
          hovered: { value: 'R800' },
          pressed: { value: 'R900' },
        },
      },
      warning: {
        '[default]': {
          '[default]': { value: 'Y100' },
          hovered: { value: 'Y200' },
          pressed: { value: 'Y300' },
        },
        bold: {
          '[default]': { value: 'Y400' },
          hovered: { value: 'Y500' },
          pressed: { value: 'Y600' },
        },
      },
      success: {
        '[default]': {
          '[default]': { value: 'G100' },
          hovered: { value: 'G200' },
          pressed: { value: 'G300' },
        },
        bold: {
          '[default]': { value: 'G700' },
          hovered: { value: 'G800' },
          pressed: { value: 'G900' },
        },
      },
      discovery: {
        '[default]': {
          '[default]': { value: 'P100' },
          hovered: { value: 'P200' },
          pressed: { value: 'P300' },
        },
        bold: {
          '[default]': { value: 'P700' },
          hovered: { value: 'P800' },
          pressed: { value: 'P900' },
        },
      },
      information: {
        '[default]': {
          '[default]': { value: 'B100' },
          hovered: { value: 'B200' },
          pressed: { value: 'B300' },
        },
        bold: {
          '[default]': { value: 'B700' },
          hovered: { value: 'B800' },
          pressed: { value: 'B900' },
        },
      },
    },
  },
};

export default color;
