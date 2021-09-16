import type { AttributeSchema, BorderColorTokenSchema } from '../../../types';

const color: AttributeSchema<BorderColorTokenSchema> = {
  color: {
    border: {
      focus: {
        attributes: {
          group: 'paint',
          description: 'Use for focus rings of elements in a focus state',
        },
      },
      neutral: {
        attributes: {
          group: 'paint',
          description:
            'Use to create borders around UI elements such as text fields, checkboxes, and radio buttons, or to visually group or separate UI elements, such as flat cards or side panel dividers',
        },
      },
    },
  },
};

export default color;
