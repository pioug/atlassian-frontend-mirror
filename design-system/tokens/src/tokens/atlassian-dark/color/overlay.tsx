import type { OverlayColorTokenSchema } from '../../../types';

const color: OverlayColorTokenSchema = {
  color: {
    overlay: {
      hover: {
        value: 'DN400A',
        attributes: { group: 'paint' },
      },
      pressed: {
        value: 'DN500A',
        attributes: { group: 'paint' },
      },
    },
  },
};

export default color;
