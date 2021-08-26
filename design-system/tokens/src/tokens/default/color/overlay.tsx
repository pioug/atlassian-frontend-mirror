import type { AttributeSchema, OverlayColorTokenSchema } from '../../../types';

const color: AttributeSchema<OverlayColorTokenSchema> = {
  color: {
    overlay: {
      hover: {
        attributes: { group: 'paint', description: '' },
      },
      pressed: {
        attributes: { group: 'paint', description: '' },
      },
    },
  },
};

export default color;
