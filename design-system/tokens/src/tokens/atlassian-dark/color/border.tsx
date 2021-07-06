import type { BorderColorTokenSchema } from '../../../types';

const color: BorderColorTokenSchema = {
  color: {
    border: {
      focus: {
        value: [
          {
            color: 'B300',
            offset: { x: 0, y: 0 },
            opacity: 1,
            radius: 0,
            spread: 4,
          },
          {
            color: 'DN0',
            offset: { x: 0, y: 0 },
            opacity: 1,
            radius: 0,
            spread: 2,
          },
        ],
        attributes: { group: 'shadow' },
      },
      neutral: {
        value: 'DN300A',
        attributes: { group: 'paint' },
      },
      disabled: {
        value: 'N100A',
        attributes: { group: 'paint' },
      },
      overlay: {
        value: 'DN100A',
        attributes: { group: 'paint' },
      },
    },
  },
};

export default color;
