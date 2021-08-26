import type { AttributeSchema, TextColorTokenSchema } from '../../../types';

const color: AttributeSchema<TextColorTokenSchema> = {
  color: {
    text: {
      selected: {
        attributes: { group: 'paint', description: '' },
      },
      highEmphasis: {
        attributes: { group: 'paint', description: '' },
      },
      mediumEmphasis: {
        attributes: { group: 'paint', description: '' },
      },
      lowEmphasis: {
        attributes: { group: 'paint', description: '' },
      },
      onBold: {
        attributes: { group: 'paint', description: '' },
      },
      onBoldWarning: {
        attributes: { group: 'paint', description: '' },
      },
      link: {
        resting: {
          attributes: { group: 'paint', description: '' },
        },
        pressed: {
          attributes: { group: 'paint', description: '' },
        },
      },
      brand: {
        attributes: { group: 'paint', description: '' },
      },
      warning: {
        attributes: { group: 'paint', description: '' },
      },
      danger: {
        attributes: { group: 'paint', description: '' },
      },
      success: {
        attributes: { group: 'paint', description: '' },
      },
      discovery: {
        attributes: { group: 'paint', description: '' },
      },
      disabled: {
        attributes: { group: 'paint', description: '' },
      },
    },
  },
};

export default color;
