import type { IconColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<IconColorTokenSchema> = {
  color: {
    icon: {
      '[default]': {
        value: 'DN800',
      },
      subtle: {
        value: 'DN700',
      },
      inverse: {
        value: 'DN0',
      },
      disabled: {
        value: 'DN500',
      },
      brand: {
        value: 'B400',
      },
      danger: {
        value: 'R500',
      },
      warning: {
        '[default]': {
          value: 'Y500',
        },
        inverse: {
          value: 'DN0',
        },
      },
      success: {
        value: 'G500',
      },
      discovery: {
        value: 'P500',
      },
      information: {
        value: 'B500',
      },
    },
  },
};

export default color;
