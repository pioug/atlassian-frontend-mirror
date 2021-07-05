import type { ShadowTokenSchema } from '../../../types';

const shadow: ShadowTokenSchema = {
  shadow: {
    card: {
      value: [
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'N1100',
          opacity: 0.3,
        },
        {
          radius: 1,
          offset: { x: 0, y: 1 },
          color: 'N1100',
          opacity: 0.25,
        },
      ],
      attributes: { group: 'shadow' },
    },
    overlay: {
      value: [
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'N1100',
          opacity: 0.3,
        },
        {
          radius: 12,
          offset: { x: 0, y: 8 },
          color: 'N1100',
          opacity: 0.15,
        },
      ],
      attributes: { group: 'shadow' },
    },
  },
};

export default shadow;
