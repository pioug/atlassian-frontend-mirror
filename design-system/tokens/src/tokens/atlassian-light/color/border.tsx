import type { BorderColorTokenSchema } from '../../../types';

const color: BorderColorTokenSchema = {
  color: {
    borderFocus: {
      value: [
        {
          color: 'B500',
          offset: { x: 0, y: 0 },
          opacity: 1,
          radius: 0,
          spread: 4,
        },
        {
          color: 'N0',
          offset: { x: 0, y: 0 },
          opacity: 1,
          radius: 0,
          spread: 2,
        },
      ],
      attributes: { group: 'shadow' },
    },
    borderTextHighlighted: {
      value: 'B700',
      attributes: { group: 'paint' },
    },
    borderNeutral: {
      value: 'N300A',
      attributes: { group: 'paint' },
    },
    borderDisabled: {
      value: 'N100A',
      attributes: { group: 'paint' },
    },
  },
};

export default color;
