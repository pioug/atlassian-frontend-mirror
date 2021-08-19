import type { BorderColorTokenSchema } from '../../../types';

const color: BorderColorTokenSchema = {
  color: {
    border: {
      focus: {
        value: 'B500',
        attributes: { group: 'paint' },
      },
      neutral: {
        value: 'N300A',
        attributes: { group: 'paint' },
      },
    },
  },
};

export default color;
