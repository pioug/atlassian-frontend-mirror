import type { OverlayColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<OverlayColorTokenSchema> = {
  color: {
    overlay: {
      hover: {
        value: 'N400A',
      },
      pressed: {
        value: 'N500A',
      },
    },
  },
};

export default color;
