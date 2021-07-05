import type { BorderColorTokenSchema } from '../../../types';

const color: BorderColorTokenSchema = {
  color: {
    borderFocus: {
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
    borderTextSelected: {
      value: 'B400',
      attributes: { group: 'paint' },
    },
    borderNeutral: {
      value: 'DN300A',
      attributes: { group: 'paint' },
    },
    borderDisabled: {
      value: 'N100A',
      attributes: { group: 'paint' },
    },
    borderOverlay: {
      value: 'DN100A',
      attributes: { group: 'paint' },
    },
  },
};

export default color;
