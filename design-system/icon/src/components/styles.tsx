import type { Size } from '../types';
import { dimensions } from '../constants';
import { css, CSSObject } from '@emotion/core';

export const commonSVGStyles = {
  overflow: 'hidden',
  pointerEvents: 'none',
  /**
   * Stop-color doesn't properly apply in chrome when the inherited/current color changes.
   * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS
   * rule) and then override it with currentColor for the color changes to be picked up.
   */
  stop: {
    stopColor: 'currentColor',
  },

  /**
   * For windows high contrast mode
   */
  '@media screen and (-ms-high-contrast: white-on-black)': {
    filter: ' grayscale(100%)',
    color: '#fff', // N0
    fill: '#000', // DN0
  },
  '@media screen and (-ms-high-contrast: black-on-white)': {
    filter: 'grayscale(100%)',
    color: '#000', // DN0
    fill: '#fff', // N0
  },
} as CSSObject;

const small = css(dimensions.small);
const medium = css(dimensions.medium);
const large = css(dimensions.large);
const xlarge = css(dimensions.xlarge);

// pre-built css style-size map
export const sizeStyleMap = {
  small,
  medium,
  large,
  xlarge,
};

/**
 * Returns the width of the icon's parent span. This function has
 * special behaviour to deal with icon-file-type specifically.
 *
 * The reality is the SVG still has its own dimensions, so this is
 * a secondary fallback which in 95% of cases is not required.
 * It's only really being kept to maintain backward compatability.
 */
export const getIconSize = ({
  width,
  height,
  size,
}: {
  size?: Size;
  width?: number;
  height?: number;
}) => {
  if (width && height) {
    return { width, height };
  }

  if (size) {
    return dimensions[size];
  }

  return undefined;
};
