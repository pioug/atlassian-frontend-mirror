import type { BorderColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<BorderColorTokenSchema> = {
  color: {
    border: {
      focus: {
        value: 'B300',
      },
      neutral: {
        value: 'DN300A',
      },
    },
  },
};

export default color;
