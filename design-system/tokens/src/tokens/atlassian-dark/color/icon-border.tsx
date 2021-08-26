import type { IconBorderColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<IconBorderColorTokenSchema> = {
  color: {
    iconBorder: {
      brand: {
        value: 'B500',
      },
      danger: {
        value: 'R500',
      },
      warning: {
        value: 'Y500',
      },
      success: {
        value: 'G500',
      },
      discovery: {
        value: 'P500',
      },
    },
  },
};

export default color;
