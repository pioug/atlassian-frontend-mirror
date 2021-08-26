import type { AttributeSchema, BorderColorTokenSchema } from '../../../types';

const color: AttributeSchema<BorderColorTokenSchema> = {
  color: {
    border: {
      focus: {
        attributes: { group: 'paint', description: '' },
      },
      neutral: {
        attributes: { group: 'paint', description: '' },
      },
    },
  },
};

export default color;
