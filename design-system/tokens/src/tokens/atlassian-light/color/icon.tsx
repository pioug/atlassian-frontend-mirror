import type { IconColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<IconColorTokenSchema> = {
  color: {
    icon: {
      '[default]': {
        value: 'N800',
      },
      subtle: {
        value: 'N700',
      },
      inverse: {
        value: 'N0',
      },
      disabled: {
        value: 'N400A',
      },
      brand: {
        value: 'B700',
      },
      selected: {
        value: 'B700',
      },
      danger: {
        value: 'R600',
      },
      warning: {
        '[default]': {
          value: 'O600',
        },
        inverse: {
          value: 'N1000',
        },
      },
      success: {
        value: 'G600',
      },
      discovery: {
        value: 'P600',
      },
      information: {
        value: 'B600',
      },
    },
  },
};

export default color;
