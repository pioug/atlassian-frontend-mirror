// eslint-disable-next-line import/prefer-default-export
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
