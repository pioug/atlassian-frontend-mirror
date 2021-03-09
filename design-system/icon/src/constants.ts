import type { Size } from './types';

export const sizes: Record<Size, string> = {
  small: '16px',
  medium: '24px',
  large: '32px',
  xlarge: '48px',
};

export const sizeMap: Record<Size, Size> = {
  small: 'small',
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge',
};
