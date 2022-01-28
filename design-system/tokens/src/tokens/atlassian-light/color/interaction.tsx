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
      inverse: {
        hovered: {
          // @ts-ignore temporary values
          value: '#00000029',
        },
        pressed: {
          // @ts-ignore temporary values
          value: '#00000052',
        },
      },
    },
  },
};

export default color;
