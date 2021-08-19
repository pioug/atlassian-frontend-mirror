import type { OverlayColorTokenSchema } from '../../../types';

const color: OverlayColorTokenSchema = {
  color: {
    overlay: {
      hover: {
        value: 'N400A',
        attributes: { group: 'paint' },
      },
      pressed: {
        value: 'N500A',
        attributes: { group: 'paint' },
      },
    },
  },
};

export default color;
