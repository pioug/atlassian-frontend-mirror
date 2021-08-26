import type { ShadowTokenSchema, ValueSchema } from '../../../types';

const shadow: ValueSchema<ShadowTokenSchema> = {
  shadow: {
    card: {
      value: [
        {
          radius: 1,
          offset: { x: 0, y: 1 },
          color: 'N1100',
          opacity: 0.25,
        },
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'N1100',
          opacity: 0.31,
        },
      ],
    },
    overlay: {
      value: [
        {
          radius: 12,
          offset: { x: 0, y: 8 },
          color: 'N1100',
          opacity: 0.15,
        },
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'N1100',
          opacity: 0.31,
        },
      ],
    },
  },
};

export default shadow;
