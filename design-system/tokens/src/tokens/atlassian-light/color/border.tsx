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
      disabled: {
        value: 'N100A',
        attributes: { group: 'paint' },
      },
      overlay: {
        value: 'N0',
        attributes: { group: 'paint' },
      },
    },
  },
};

export default color;
