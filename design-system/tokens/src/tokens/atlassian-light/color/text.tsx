import type { TextColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<TextColorTokenSchema> = {
  color: {
    text: {
      '[default]': {
        value: 'N1000',
      },
      subtle: {
        value: 'N800',
      },
      subtlest: {
        value: 'N700',
      },
      inverse: {
        value: 'N0',
      },
      disabled: {
        value: 'N500',
      },

      brand: {
        value: 'B700',
      },
      danger: {
        value: 'R800',
      },
      warning: {
        '[default]': {
          value: 'O800',
        },
        inverse: {
          value: 'N1000',
        },
      },
      success: {
        value: 'G800',
      },
      information: {
        value: 'B800',
      },
      discovery: {
        value: 'P800',
      },
    },
    link: {
      '[default]': {
        value: 'B700',
      },
      pressed: {
        value: 'B800',
      },
    },
  },
};

export default color;
