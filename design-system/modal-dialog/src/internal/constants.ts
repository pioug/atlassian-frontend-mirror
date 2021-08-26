import {
  text as getTextColor,
  N30,
  N800,
  R400,
  Y400,
} from '@atlaskit/theme/colors';
import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import type { Appearance } from '../types';

export type WidthNames = 'small' | 'medium' | 'large' | 'x-large';

interface Width {
  values: string[];
  widths: { [index in WidthNames]: number };
  defaultValue: string;
}

export const width: Width = {
  values: ['small', 'medium', 'large', 'x-large'],
  widths: {
    small: 400,
    medium: 600,
    large: 800,
    'x-large': 968,
  },
  defaultValue: 'medium',
};

export const gutter = 60;

const gridSize = getGridSize();
export const borderRadius = getBorderRadius();

export const verticalOffset = gridSize * 2;
export const padding = gridSize * 3;
export const footerItemGap = gridSize;
export const titleIconMargin = gridSize;

export const keylineHeight = 2;
export const keylineColor = N30;

export const textColor = getTextColor();
export const focusOutlineColor = N800;

type IconColor = { [key in Appearance]: string };
export const iconColor: IconColor = {
  danger: R400,
  warning: Y400,
} as const;
