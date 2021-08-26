import type { ShadowTokenSchema, ValueSchema } from '../../../types';

const shadow: ValueSchema<ShadowTokenSchema> = {
  shadow: {
    card: {
      value: [
        {
          radius: 1,
          offset: { x: 0, y: 1 },
          color: 'DN-100A',
          // This opacity overrides the color alpha.
          opacity: 0.5,
        },
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'DN-100A',
          // This opacity overrides the color alpha.
          opacity: 0.5,
        },
      ],
    },
    overlay: {
      value: [
        {
          radius: 0,
          spread: 1,
          color: 'DN100A',
          offset: { x: 0, y: 0 },
          opacity: 0.04,
          inset: true,
        },
        {
          radius: 12,
          offset: { x: 0, y: 8 },
          color: 'DN-100A',
          // This opacity overrides the color alpha.
          opacity: 0.36,
        },
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'DN-100A',
          // This opacity overrides the color alpha.
          opacity: 0.5,
        },
      ],
    },
  },
};

export default shadow;
