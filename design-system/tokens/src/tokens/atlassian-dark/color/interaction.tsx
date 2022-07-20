import type { InteractionColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<InteractionColorTokenSchema> = {
  color: {
    interaction: {
      hovered: {
        // @ts-ignore temporary values
        value: '#ffffff33',
      },
      pressed: {
        // @ts-ignore temporary values
        value: '#ffffff5c',
      },
    },
  },
};

export default color;
