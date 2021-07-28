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
} as CSSObject;

const smallStyles = css(dimensions.small);
const mediumStyles = css(dimensions.medium);
const largeStyles = css(dimensions.large);
const xlargeStyles = css(dimensions.xlarge);

// pre-built css style-size map
export const sizeStyleMap = {
  small: smallStyles,
  medium: mediumStyles,
  large: largeStyles,
  xlarge: xlargeStyles,
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
