import type { BaseToken } from '../../../palettes/palette';
import type { AttributeSchema, BorderColorTokenSchema } from '../../../types';

const color: AttributeSchema<BorderColorTokenSchema<BaseToken>> = {
  color: {
    border: {
      '[default]': {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use to visually group or separate UI elements, such as flat cards or side panel dividers.',
        },
      },
      bold: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.10.8',
          description:
            'A neutral border option that passes min 3:1 contrast ratios.',
        },
      },
      inverse: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description: 'Use for borders on bold backgrounds.',
        },
      },
      focused: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description: 'Use for focus rings of elements in a focus state.',
        },
      },
      input: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use for borders of form UI elements, such as text fields, checkboxes, and radio buttons.',
        },
      },
      disabled: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description: 'Use for borders of elements in a disabled state.',
        },
      },
      brand: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use for borders or visual indicators of elements that reinforce our brand, such as logos or primary buttons.',
        },
      },
      selected: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.2',
          description:
            'Use for borders or visual indicators of elements in a selected or opened state, such as in tabs or menu items.',
        },
      },
      danger: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use for borders communicating critical information, such as the borders on invalid text fields.',
        },
      },
      warning: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description: 'Use for borders communicating caution.',
        },
      },
      success: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use for borders communicating a favorable outcome, such as the borders on validated text fields.',
        },
      },
      discovery: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use for borders communicating change or something new, such as the borders in onboarding spotlights.',
        },
      },
      information: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use for borders communicating information or something in-progress.',
        },
      },
    },
  },
};

export default color;
