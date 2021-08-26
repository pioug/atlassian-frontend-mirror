import type { AttributeSchema, ShadowTokenSchema } from '../../../types';

const shadow: AttributeSchema<ShadowTokenSchema> = {
  shadow: {
    card: {
      attributes: { group: 'shadow', description: '' },
    },
    overlay: {
      attributes: { group: 'shadow', description: '' },
    },
  },
};

export default shadow;
