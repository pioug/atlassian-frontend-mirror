import type {
  AttributeSchema,
  InteractionColorTokenSchema,
} from '../../../types';

const color: AttributeSchema<InteractionColorTokenSchema> = {
  color: {
    interaction: {
      hovered: {
        attributes: {
          group: 'paint',
          state: 'active',
          description:
            'Use as a background overlay for elements in a hovered state when their background color cannot change, such as avatars.',
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
      inverse: {
        hovered: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use as a background overlay for elements in a hovered state on bold backgrounds, such as the buttons on spotlight cards.',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use as a background overlay for elements in a hovered state on bold backgrounds, such as the buttons on spotlight cards.',
          },
        },
      },
    },
  },
};

export default color;
