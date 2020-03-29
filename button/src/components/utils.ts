import React from 'react';
import { ButtonProps } from '../types';

export const mapAttributesToState = ({
  isDisabled = false,
  isActive = false,
  isFocus = false,
  isHover = false,
  isSelected = false,
}) => {
  if (isDisabled) {
    return 'disabled';
  }
  if (isSelected && isFocus) {
    return 'focusSelected';
  }
  if (isSelected) {
    return 'selected';
  }
  if (isActive) {
    return 'active';
  }
  if (isHover) {
    return 'hover';
  }
  if (isFocus) {
    return 'focus';
  }
  return 'default';
};

export const filterProps = (
  // @ts-ignore - createAnalyticsEvent is injected from WithAnalyticsEvents HOC
  { createAnalyticsEvent, ...props }: Partial<ButtonProps>,
  type: React.ReactNode,
) => {
  if (type === 'span') {
    const { target, href, ...rest } = props;
    return rest;
  }
  return props;
};

export const getLoadingStyle = (isLoading?: boolean) => ({
  transition: 'opacity 0.3s',
  opacity: isLoading ? 0 : 1,
});

export const composeRefs = (...refs: any[]) => {
  return (x: HTMLElement) => {
    refs
      .filter(r => !!r)
      .forEach(ref => {
        if (typeof ref === 'function') {
          ref(x);
        } else {
          ref.current = x;
        }
      });
  };
};

/**
 * Convert a hex colour code to RGBA.
 * @param {String} hex Hex colour code.
 * @param {Number} alpha Optional alpha value (defaults to 1).
 */
export function hex2rgba(hex: string, alpha = 1) {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let colorArr = hex.substring(1).split('');

    if (colorArr.length === 3) {
      colorArr = [
        colorArr[0],
        colorArr[0],
        colorArr[1],
        colorArr[1],
        colorArr[2],
        colorArr[2],
      ];
    }

    const color = `0x${colorArr.join('')}`;

    // FIXME: `>>` operand can validly take a string value
    const r = ((color as any) >> 16) & 255;
    const g = ((color as any) >> 8) & 255;
    const b = (color as any) & 255;

    return `rgba(${[r, g, b].join(',')}, ${alpha})`;
  }

  throw new Error('Bad Hex');
}
