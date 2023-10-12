import type { AttributeSchema, IconColorTokenSchema } from '../../../src/types';
import type { BaseToken } from '../../palettes/palette';

const color: AttributeSchema<IconColorTokenSchema<BaseToken>> = {
  color: {
    icon: {
      '[default]': {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use for icon-only buttons, or icons paired with color.text',
        },
      },
      subtle: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description: 'Use for icons paired with color.text.subtle',
        },
      },
      inverse: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description: 'Use for icons on bold backgrounds.',
        },
      },
      disabled: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description: 'Use for icons in a disabled state.',
        },
      },
      brand: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description: 'Use for icons that reinforce our brand.',
        },
      },
      selected: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.2',
          description:
            'Use for icons in selected or opened states, such as those used in dropdown buttons.',
        },
      },
      danger: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use for icons communicating critical information, such as those used in error handing.',
        },
      },
      warning: {
        '[default]': {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for icons communicating caution, such as those used in warning section messages.',
          },
        },
        inverse: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description: 'Use for icons when on bold warning backgrounds.',
          },
        },
      },
      success: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use for icons communicating a favorable outcome, such as those used in success section messaged.',
        },
      },
      discovery: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use for icons communicating change or something new, such as discovery section messages.',
        },
      },
      information: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use for icons communicating information or something in-progress, such as information section messages.',
        },
      },
    },
  },
};

export default color;
