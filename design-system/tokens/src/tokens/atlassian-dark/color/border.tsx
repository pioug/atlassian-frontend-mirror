import type { BorderColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<BorderColorTokenSchema> = {
  color: {
    border: {
      '[default]': {
        value: 'DN300A',
      },
      bold: {
        value: 'DN600',
      },
      inverse: {
        value: 'DN0',
      },
      focused: {
        value: 'B300',
      },
      input: {
        value: 'DN300A',
      },
      disabled: {
        value: 'DN200A',
      },
      brand: {
        value: 'B400',
      },
      selected: {
        value: 'B400',
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
      information: {
        value: 'B500',
      },
    },
  },
};

export default color;
