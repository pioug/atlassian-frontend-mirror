import type { AttributeSchema, OverlayColorTokenSchema } from '../../../types';

const color: AttributeSchema<OverlayColorTokenSchema> = {
  color: {
    overlay: {
      hover: {
        attributes: {
          group: 'paint',
          state: 'active',
          description:
            'Use as a background overlay for elements in a hover state when their background color cannot change, such as avatars.',
        },
      },
      pressed: {
        attributes: {
          group: 'paint',
          state: 'active',
          description:
            'Use as a background overlay for elements in a pressed state when their background color cannot change, such as avatars.',
        },
      },
    },
  },
};

export default color;
