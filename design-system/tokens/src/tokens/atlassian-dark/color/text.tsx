import type { TextColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<TextColorTokenSchema> = {
  color: {
    text: {
      '[default]': {
        value: 'DN1000',
      },
      subtle: {
        value: 'DN800',
      },
      subtlest: {
        value: 'DN700',
      },
      inverse: {
        value: 'DN0',
      },
      disabled: {
        value: 'DN400A',
      },
      brand: {
        value: 'B400',
      },
      selected: {
        value: 'B400',
      },
      danger: {
        value: 'R300',
      },
      warning: {
        '[default]': {
          value: 'Y300',
        },
        inverse: {
          value: 'DN0',
        },
      },
      success: {
        value: 'G300',
      },
      information: {
        value: 'B300',
      },
      discovery: {
        value: 'P300',
      },
    },
    link: {
      '[default]': {
        value: 'B400',
      },
      pressed: {
        value: 'B300',
      },
    },
  },
};

export default color;
