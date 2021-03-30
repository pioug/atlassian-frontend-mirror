import { css } from '@emotion/core';
import type { IconProps, Size } from '../types';
import { sizes } from '../constants';

export const getSVGStyles = ({
  primaryColor,
  secondaryColor,
}: Partial<IconProps>) => css`
  overflow: hidden;
  pointer-events: none;
  color: ${primaryColor || 'currentColor'};
  fill: ${secondaryColor};

  /**
  * Stop-color doesn't properly apply in chrome when the inherited/current color changes.
  * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS
  * rule) and then override it with currentColor for the color changes to be picked up.
  */
  stop {
    stop-color: currentColor;
  }
`;

/**
 * Returns the width of the icon's parent span. This function has
 * special behaviour to deal with icon-file-type specifically.
 *
 * The reality is the SVG still has its own dimensions, so this is
 * a secondary fallback which in 95% of cases is not required.
 * It's only really being kept to maintain backward compatability.
 */
export const getSizeStyles = ({
  width,
  height,
  size,
}: {
  size?: Size;
  width?: number;
  height?: number;
}) => {
  if (width && height) {
    return `height: ${height}px; width: ${width}px;`;
  }

  if (size) {
    return `height: ${sizes[size]}; width: ${sizes[size]};`;
  }

  return '';
};
