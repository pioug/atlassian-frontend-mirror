import type { OverlayColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<OverlayColorTokenSchema> = {
  color: {
    overlay: {
      hover: {
        value: 'DN400A',
      },
      pressed: {
        value: 'DN500A',
      },
    },
  },
};

export default color;
