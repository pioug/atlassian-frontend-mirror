import type { BackgroundColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<BackgroundColorTokenSchema> = {
  color: {
    blanket: { value: 'DN-100A' },
    background: {
      disabled: { value: 'DN200A' },
      // @ts-ignore temporary value
      inverse: { value: '#ffffff33' },
      input: {
        '[default]': { value: 'DN100A' },
        hovered: { value: 'DN0' },
        pressed: { value: 'DN200A' },
      },
      neutral: {
        '[default]': {
          '[default]': { value: 'DN200A' },
          hovered: { value: 'DN300A' },
          pressed: { value: 'DN400A' },
        },
        subtle: {
          // @ts-ignore temporary value
          '[default]': { value: 'transparent' },
          hovered: { value: 'DN200A' },
          pressed: { value: 'DN300A' },
        },
        bold: {
          '[default]': { value: 'DN800' },
          hovered: { value: 'DN900' },
          pressed: { value: 'DN1000' },
        },
      },
      brand: {
        '[default]': {
          '[default]': { value: 'DN200A' },
          hovered: { value: 'DN300A' },
          pressed: { value: 'DN400A' },
        },
        bold: {
          '[default]': { value: 'B400' },
          hovered: { value: 'B300' },
          pressed: { value: 'B200' },
        },
      },
      danger: {
        '[default]': {
          '[default]': { value: 'R1000' },
          hovered: { value: 'R900' },
          pressed: { value: 'R800' },
        },
        bold: {
          '[default]': { value: 'R400' },
          hovered: { value: 'R300' },
          pressed: { value: 'R200' },
        },
      },
      warning: {
        '[default]': {
          '[default]': { value: 'Y1000' },
          hovered: { value: 'Y900' },
          pressed: { value: 'Y800' },
        },
        bold: {
          '[default]': { value: 'Y400' },
          hovered: { value: 'Y300' },
          pressed: { value: 'Y200' },
        },
      },
      success: {
        '[default]': {
          '[default]': { value: 'G1000' },
          hovered: { value: 'G900' },
          pressed: { value: 'G800' },
        },
        bold: {
          '[default]': { value: 'G400' },
          hovered: { value: 'G300' },
          pressed: { value: 'G200' },
        },
      },
      discovery: {
        '[default]': {
          '[default]': { value: 'P1000' },
          hovered: { value: 'P900' },
          pressed: { value: 'P800' },
        },
        bold: {
          '[default]': { value: 'P400' },
          hovered: { value: 'P300' },
          pressed: { value: 'P200' },
        },
      },
      information: {
        '[default]': {
          '[default]': { value: 'B1000' },
          hovered: { value: 'B900' },
          pressed: { value: 'B800' },
        },
        bold: {
          '[default]': { value: 'B400' },
          hovered: { value: 'B300' },
          pressed: { value: 'B200' },
        },
      },
    },
  },
};

export default color;
