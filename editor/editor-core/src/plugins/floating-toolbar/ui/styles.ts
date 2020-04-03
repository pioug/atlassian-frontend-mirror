import { colors } from '@atlaskit/theme';
import { hexToRgba } from '@atlaskit/adf-schema';

interface Property {
  [key: string]: {
    [key: string]: any;
  };
}

const background: Property = {
  danger: {
    default: { light: 'inherit', dark: 'inherit' },
    hover: { light: colors.N30A, dark: colors.N30A },
    active: {
      light: hexToRgba(colors.B75, 0.6),
      dark: hexToRgba(colors.B75, 0.6),
    },
  },
};

const color = {
  danger: {
    default: { light: colors.N400, dark: colors.DN400 },
    hover: { light: colors.R300, dark: colors.R300 },
    active: { light: colors.R300, dark: colors.R300 },
  },
};

const getStyles = (
  property: Property,
  { appearance = 'default', state = 'default', mode = 'light' },
) => {
  if (!property[appearance] || !property[appearance][state]) {
    return 'initial';
  }
  return property[appearance][state][mode];
};

export const baseStyles = {
  padding: '0 2px',
  '&[href]': {
    padding: '0 2px',
  },
};

export const getButtonStyles = (props: any) => ({
  background: getStyles(background, props),
  color: getStyles(color, props),
});
