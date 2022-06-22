import type { BorderColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<BorderColorTokenSchema> = {
  color: {
    border: {
      '[default]': {
        value: 'N300A',
      },
      bold: {
        value: 'N600',
      },
      inverse: {
        value: 'N0',
      },
      focused: {
        value: 'B500',
      },
      input: {
        value: 'N300A',
      },
      disabled: {
        value: 'N200A',
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
        value: 'O600',
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
