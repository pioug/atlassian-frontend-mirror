import { CSSObject } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';

import { Size } from '../types';

import { getColors } from './colors';

type Dimensions = 'width' | 'height';
type DimensionsObject = { [key in Size]: { [key in Dimensions]: number } };

const globalGridSize = gridSize();

const dimensions: DimensionsObject = {
  regular: {
    height: globalGridSize * 2,
    width: globalGridSize * 4,
  },
  large: {
    height: globalGridSize * 2 + globalGridSize / 2,
    width: globalGridSize * 5,
  },
};

const getHeight = ({ size }: { size: Size }) => dimensions[size].height;
const getWidth = ({ size }: { size: Size }) => dimensions[size].width;

const borderWidth = 2;
const paddingUnitless = globalGridSize / 4;
const transition = 'transform 0.2s ease';

export const getStyles = (size: Size, mode: ThemeModes): CSSObject => {
  const colors = getColors(mode);

  return {
    boxSizing: 'content-box',
    display: 'inline-block',
    padding: borderWidth,
    margin: borderWidth,
    backgroundClip: 'content-box',
    backgroundColor: colors.backgroundColorUnchecked,
    borderRadius: `${getHeight({ size })}px`,
    border: `${borderWidth}px solid transparent`,
    height: `${getHeight({ size })}px`,
    position: 'relative',
    transition: `${transition}`,
    width: `${getWidth({ size })}px`,

    '&[data-checked]': {
      backgroundColor: colors.backgroundColorChecked,
      color: colors.iconColorChecked,
    },

    '&[data-disabled]:not([data-checked])': {
      backgroundColor: colors.backgroundColorUncheckedDisabled,
    },

    '&[data-disabled][data-checked],&[data-disabled][data-checked]:hover': {
      backgroundColor: colors.backgroundColorCheckedDisabled,
    },

    '&:focus-within': {
      border: `${borderWidth}px solid ${colors.borderColorFocus}`,
    },

    '&:hover': {
      backgroundColor: colors.backgroundColorUncheckedHover,
      cursor: 'pointer',
    },

    '&[data-disabled]:hover,&[data-disabled][data-checked]:hover,&[data-disabled]:not([data-checked]):hover': {
      cursor: 'not-allowed',
    },

    '&[data-checked]:hover': {
      backgroundColor: colors.backgroundColorCheckedHover,
    },

    '&:not([data-checked]):hover': {
      backgroundColor: colors.backgroundColorUncheckedHover,
    },

    '&[data-disabled]:not([data-checked]):hover': {
      backgroundColor: colors.backgroundColorCheckedDisabled,
    },

    color: colors.iconColorUnchecked,

    '&[data-disabled], &[data-disabled][data-checked], &[data-disabled][data-checked]:hover': {
      color: colors.iconColorDisabled,
    },

    // the input element underneath
    'input[type="checkbox"]': {
      opacity: 0,
      margin: 0,
      padding: 0,
      border: 'none',

      '&:focus': {
        outline: 'none !important',
      },
    },

    // slider
    '::before': {
      backgroundColor: colors.handleBackgroundColor,
      borderRadius: '50%',
      content: '""',
      position: 'absolute',
      transform: 'initial',
      transition: transition,

      bottom: `${2 * paddingUnitless}px`,
      height: `${getHeight({ size }) - paddingUnitless * 2}px`,
      width: `${getHeight({ size }) - paddingUnitless * 2}px`,

      // initially we set left as left-most position
      left: `${2 * paddingUnitless}px`,
    },

    '&[data-checked]::before': {
      backgroundColor: colors.handleBackgroundColorChecked,

      // when  it's checked, slide the pseudo-element to right-most postion
      transform: `translateX(${getHeight({ size })}px)`,
    },

    '&[data-disabled]::before': {
      backgroundColor: colors.handleBackgroundColorDisabled,
      zIndex: 1,
    },

    // icons - check and cross
    '> span': {
      position: 'absolute',
      top: `${paddingUnitless}px`,
    },

    '>span:first-of-type': {
      left: `3px`,
    },

    '>span:last-of-type': {
      right: `3px`,
    },

    ...(size === 'large' && {
      '> span': {
        position: 'absolute',
        height: '20px',
        width: '20px',
      },
    }),

    '@media screen and (forced-colors: active)': {
      '::before': {
        filter: 'grayscale(100%) invert(1)',
      },
      '&:focus-within': {
        outline: '1px solid',
      },
    },
  };
};
