import type {
  AttributeSchema,
  InteractionColorTokenSchema,
} from '../../../src/types';
import type { BaseToken } from '../../palettes/palette';

const color: AttributeSchema<InteractionColorTokenSchema<BaseToken>> = {
  color: {
    interaction: {
      hovered: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use as a background overlay for elements in a hovered state when their background color cannot change, such as avatars.',
        },
      },
      pressed: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use as a background overlay for elements in a pressed state when their background color cannot change, such as avatars.',
        },
      },
    },
  },
};

export default color;
