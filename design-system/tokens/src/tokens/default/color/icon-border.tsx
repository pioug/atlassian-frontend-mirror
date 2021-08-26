import type {
  AttributeSchema,
  IconBorderColorTokenSchema,
} from '../../../types';

const color: AttributeSchema<IconBorderColorTokenSchema> = {
  color: {
    iconBorder: {
      brand: {
        attributes: { group: 'paint', description: '' },
      },
      danger: {
        attributes: { group: 'paint', description: '' },
      },
      warning: {
        attributes: { group: 'paint', description: '' },
      },
      success: {
        attributes: { group: 'paint', description: '' },
      },
      discovery: {
        attributes: { group: 'paint', description: '' },
      },
    },
  },
};

export default color;
