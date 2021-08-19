import type { BorderColorTokenSchema } from '../../../types';

const color: BorderColorTokenSchema = {
  color: {
    border: {
      focus: {
        value: 'B300',
        attributes: { group: 'paint' },
      },
      neutral: {
        value: 'DN300A',
        attributes: { group: 'paint' },
      },
    },
  },
};

export default color;
