import type { ShadowTokenSchema } from '../../../types';

const shadow: ShadowTokenSchema = {
  shadow: {
    card: {
      value: [
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'DN100',
          opacity: 0.36,
        },
        {
          radius: 1,
          offset: { x: 0, y: 1 },
          color: 'DN100',
          opacity: 0.5,
        },
      ],
      attributes: { group: 'shadow' },
    },
    overlay: {
      value: [
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'DN0',
          opacity: 0.5,
        },
        {
          radius: 12,
          offset: { x: 0, y: 8 },
          color: 'DN0',
          opacity: 0.5,
        },
      ],
      attributes: { group: 'shadow' },
    },
  },
};

export default shadow;
