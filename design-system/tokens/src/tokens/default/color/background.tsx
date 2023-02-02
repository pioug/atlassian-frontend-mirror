import type { BaseToken } from '../../../palettes/palette';
import type {
  AttributeSchema,
  BackgroundColorTokenSchema,
} from '../../../types';

const color: AttributeSchema<BackgroundColorTokenSchema<BaseToken>> = {
  color: {
    blanket: {
      '[default]': {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.0.15',
          description:
            'Use for the screen overlay that appears with modal dialogs',
        },
      },
      selected: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            "Use as an overlay to communicate selected states when a simple background color change isn't possible, such as in Editor block elements",
        },
      },
      danger: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            "Use as an overlay to communicate danger states when a simple background color change isn't possible, such as deletion of Editor block elements",
        },
      },
    },
    background: {
      disabled: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.0.15',
          description: 'Use for backgrounds of elements in a disabled state.',
        },
      },
      inverse: {
        subtle: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.8.3',
              description:
                'Use for backgrounds of elements on a bold background, such as in the buttons on spotlight cards.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.8.3',
              description:
                'Use for the hovered state of color.background.inverse.subtle',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.8.3',
              description:
                'Use for the pressed state of color.background.inverse.subtle',
            },
          },
        },
      },
      input: {
        '[default]': {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for background of form UI elements, such as text fields, checkboxes, and radio buttons.',
          },
        },
        hovered: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description: 'Hovered state for color.background.input',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description: 'Pressed state for color.background.input',
          },
        },
      },
      neutral: {
        '[default]': {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'The default background for neutral elements, such as default buttons.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Hovered state for color.background.neutral',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Pressed state for color.background.neutral',
            },
          },
        },
        subtle: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for the background of elements that appear to have no background in a resting state, such as subtle buttons and menu items.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Hovered state for color.background.neutral.subtle',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Pressed state for color.background.neutral.subtle',
            },
          },
        },
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'A vibrant background option for neutral UI elements, such as announcement banners.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Hovered state of color.background.neutral.bold',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Pressed state of color.background.neutral.bold',
            },
          },
        },
      },
      brand: {
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for the background of elements used to reinforce our brand, but with more emphasis.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Hovered state of color.background.brand.bold',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Pressed state of color.background.brand.bold',
            },
          },
        },
      },
      selected: {
        '[default]': {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.2',
              description:
                'Use for the background of elements in a selected state, such as in opened dropdown buttons.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.2',
              description: 'Hovered state for color.background.selected',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.2',
              description: 'Pressed state for color.background.selected',
            },
          },
        },
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.2',
              description:
                'Use for the backgrounds of elements in a selected state, such as checkboxes and radio buttons.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.2',
              description: 'Hovered state of color.background.selected.bold',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.2',
              description: 'Pressed state of color.background.selected.bold',
            },
          },
        },
      },
      danger: {
        '[default]': {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for backgrounds communicating critical information, such in error section messages.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Hovered state for color.background.danger',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Pressed state for color.background.danger',
            },
          },
        },
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'A vibrant background option for communicating critical information, such as in danger buttons and error banners.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Hovered state of color.background.danger.bold',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Pressed state of color.background.danger.bold',
            },
          },
        },
      },
      warning: {
        '[default]': {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for backgrounds communicating caution, such as in warning section messages.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Hovered state for color.background.warning',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Pressed state for color.background.warning',
            },
          },
        },
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'A vibrant background option for communicating caution, such as in warning buttons and warning banners.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Hovered state of color.background.warning.bold',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Pressed state of color.background.warning.bold',
            },
          },
        },
      },
      success: {
        '[default]': {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for backgrounds communicating a favorable outcome, such as in success section messages.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Hovered state for color.background.success',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Pressed state for color.background.success',
            },
          },
        },
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'A vibrant background option for communicating a favorable outcome, such as in checked toggles.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Hovered state of color.background.success.bold',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Pressed state of color.background.success.bold',
            },
          },
        },
      },
      discovery: {
        '[default]': {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for backgrounds communicating change or something new, such as in discovery section messages.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Hover state for color.background.discovery',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Pressed state for color.background.discovery',
            },
          },
        },
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'A vibrant background option communicating change or something new, such as in onboarding spotlights.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Hovered state of color.background.discovery.bold',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Pressed state of color.background.discovery.bold',
            },
          },
        },
      },
      information: {
        '[default]': {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for backgrounds communicating information or something in-progress, such as in information section messages.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Hovered state of color.background.information',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Pressed state of color.background.information',
            },
          },
        },
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'A vibrant background option for communicating information or something in-progress.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Hovered state of color.background.information.bold',
            },
          },
          pressed: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description: 'Pressed state of color.background.information.bold',
            },
          },
        },
      },
    },
  },
};

export default color;
