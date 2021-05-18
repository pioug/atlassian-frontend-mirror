import { N30, N800, R400, Y400 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

export const WIDTH_ENUM: WidthEnumType = {
  values: ['small', 'medium', 'large', 'x-large'],
  widths: {
    small: 400,
    medium: 600,
    large: 800,
    'x-large': 968,
  },
  defaultValue: 'medium',
};

export type WidthNames = 'small' | 'medium' | 'large' | 'x-large';

export interface WidthEnumType {
  values: string[];
  widths: { [index in WidthNames]: number };
  defaultValue: string;
}

export const gutter = 60;

export const verticalOffset = gridSize() * 2;

export const modalPadding = gridSize() * 3;

export const actionMargin = gridSize();
export const titleMargin = gridSize();

export const keylineHeight = 2;
export const keylineColor = N30;

export const focusOutlineColor = N800;
export const dangerColor = R400;
export const warningColor = Y400;
