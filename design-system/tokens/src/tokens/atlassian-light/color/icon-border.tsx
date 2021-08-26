import type { IconBorderColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<IconBorderColorTokenSchema> = {
  color: {
    iconBorder: {
      brand: {
        value: 'B600',
      },
      danger: {
        value: 'R600',
      },
      warning: {
        value: 'O600',
      },
      success: {
        value: 'G600',
      },
      discovery: {
        value: 'P600',
      },
    },
  },
};

export default color;
