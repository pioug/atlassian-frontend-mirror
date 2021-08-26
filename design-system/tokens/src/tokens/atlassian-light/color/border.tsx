import type { BorderColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<BorderColorTokenSchema> = {
  color: {
    border: {
      focus: {
        value: 'B500',
      },
      neutral: {
        value: 'N300A',
      },
    },
  },
};

export default color;
