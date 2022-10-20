import type { BaseToken } from '../../../palettes/palette';
import type { BackgroundColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<BackgroundColorTokenSchema<BaseToken>> = {
  color: {
    blanket: {
      '[default]': { value: 'Neutral500A' },
      // @ts-ignore temporary value (Blue500 8% opacity)
      selected: { value: '#388BFF14' },
      // @ts-ignore temporary value (Red500 8% opacity)
      danger: { value: '#EF5C4814' },
    },
    background: {
      disabled: { value: 'Neutral100A' },
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
        '[default]': { value: 'Neutral0' },
        hovered: { value: 'Neutral100' },
        pressed: { value: 'Neutral0' },
      },
      neutral: {
        '[default]': {
          '[default]': { value: 'Neutral200A' },
          hovered: { value: 'Neutral300A' },
          pressed: { value: 'Neutral400A' },
        },
        subtle: {
          // @ts-ignore temporary value
          '[default]': { value: 'transparent' },
          hovered: { value: 'Neutral200A' },
          pressed: { value: 'Neutral300A' },
        },
        bold: {
          '[default]': { value: 'Neutral800' },
          hovered: { value: 'Neutral900' },
          pressed: { value: 'Neutral1000' },
        },
      },
      brand: {
        bold: {
          '[default]': { value: 'Blue700' },
          hovered: { value: 'Blue800' },
          pressed: { value: 'Blue900' },
        },
      },
      selected: {
        '[default]': {
          '[default]': { value: 'Blue100' },
          hovered: { value: 'Blue200' },
          pressed: { value: 'Blue300' },
        },
        bold: {
          '[default]': { value: 'Blue700' },
          hovered: { value: 'Blue800' },
          pressed: { value: 'Blue900' },
        },
      },
      danger: {
        '[default]': {
          '[default]': { value: 'Red100' },
          hovered: { value: 'Red200' },
          pressed: { value: 'Red300' },
        },
        bold: {
          '[default]': { value: 'Red700' },
          hovered: { value: 'Red800' },
          pressed: { value: 'Red900' },
        },
      },
      warning: {
        '[default]': {
          '[default]': { value: 'Yellow100' },
          hovered: { value: 'Yellow200' },
          pressed: { value: 'Yellow300' },
        },
        bold: {
          '[default]': { value: 'Yellow400' },
          hovered: { value: 'Yellow500' },
          pressed: { value: 'Yellow600' },
        },
      },
      success: {
        '[default]': {
          '[default]': { value: 'Green100' },
          hovered: { value: 'Green200' },
          pressed: { value: 'Green300' },
        },
        bold: {
          '[default]': { value: 'Green700' },
          hovered: { value: 'Green800' },
          pressed: { value: 'Green900' },
        },
      },
      discovery: {
        '[default]': {
          '[default]': { value: 'Purple100' },
          hovered: { value: 'Purple200' },
          pressed: { value: 'Purple300' },
        },
        bold: {
          '[default]': { value: 'Purple700' },
          hovered: { value: 'Purple800' },
          pressed: { value: 'Purple900' },
        },
      },
      information: {
        '[default]': {
          '[default]': { value: 'Blue100' },
          hovered: { value: 'Blue200' },
          pressed: { value: 'Blue300' },
        },
        bold: {
          '[default]': { value: 'Blue700' },
          hovered: { value: 'Blue800' },
          pressed: { value: 'Blue900' },
        },
      },
    },
  },
};

export default color;
