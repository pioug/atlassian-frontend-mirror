import { N30, R400, text, Y400 } from '@atlaskit/theme/colors';
import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

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
export const keylineColor = token('color.border.neutral', N30);
export const textColor = token('color.text.highEmphasis', text());

export const iconColor: { [key in Appearance]: string } = {
  danger: token('color.iconBorder.danger', R400),
  warning: token('color.iconBorder.warning', Y400),
} as const;
