import type {
  AccentColorTokenSchema,
  AttributeSchema,
} from '../../../src/types';
import type { BaseToken } from '../../palettes/palette';

const color: AttributeSchema<AccentColorTokenSchema<BaseToken>> = {
  color: {
    text: {
      accent: {
        blue: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for blue text on subtlest and subtler blue accent backgrounds when there is no meaning tied to the color.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for blue text on subtle blue accent backgrounds when there is no meaning tied to the color.',
            },
          },
        },
        red: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for red text on subtlest and subtler red accent backgrounds when there is no meaning tied to the color.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for red text on subtle red accent backgrounds when there is no meaning tied to the color.',
            },
          },
        },
        orange: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for orange text on subtlest and subtler orange accent backgrounds when there is no meaning tied to the color.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for orange text on subtle orange accent backgrounds when there is no meaning tied to the color.',
            },
          },
        },
        yellow: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for yellow text on subtlest and subtler yellow accent backgrounds when there is no meaning tied to the color.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for yellow text on subtle yellow accent backgrounds when there is no meaning tied to the color.',
            },
          },
        },
        green: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for green text on subtlest and subtler green accent backgrounds when there is no meaning tied to the color.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for green text on subtle green accent backgrounds when there is no meaning tied to the color.',
            },
          },
        },
        purple: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for purple text on subtlest and subtler purple accent backgrounds when there is no meaning tied to the color.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for purple text on subtle purple accent backgrounds when there is no meaning tied to the color.',
            },
          },
        },
        teal: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for teal text on subtlest and subtler teal accent backgrounds when there is no meaning tied to the color.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for teal text on subtle teal accent backgrounds when there is no meaning tied to the color.',
            },
          },
        },
        magenta: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.6.0',
              description:
                'Use for magenta text on subtlest and subtler magenta accent backgrounds when there is no meaning tied to the color.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for magenta text on subtle magenta accent backgrounds when there is no meaning tied to the color.',
            },
          },
        },
        lime: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '1.8.0',
              description:
                'Use for lime text on subtlest and subtler lime accent backgrounds when there is no meaning tied to the color.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '1.8.0',
              description:
                'Use for lime text on subtle lime accent backgrounds when there is no meaning tied to the color.',
            },
          },
        },
        gray: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.10.5',
              description:
                'Use for text on non-bold gray accent backgrounds, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.10.5',
              description:
                'Use for text and icons on gray subtle accent backgrounds.',
            },
          },
        },
      },
    },
    icon: {
      accent: {
        blue: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for blue icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        red: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for red icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        orange: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for orange icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        yellow: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for yellow icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        green: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for green icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        purple: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for purple icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        teal: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for teal icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        magenta: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for magenta icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        lime: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '1.6.0',
            description:
              'Use for lime icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        gray: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.10.5',
            description:
              'Use for icons on non-bold gray accent backgrounds, such as file type icons.',
          },
        },
      },
    },
    border: {
      accent: {
        blue: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for blue borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        red: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for red borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        orange: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for orange borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        yellow: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for yellow borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        green: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for green borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        purple: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for purple borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        teal: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for teal borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        lime: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '1.6.0',
            description:
              'Use for lime borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        magenta: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for magenta borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        gray: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.10.5',
            description: 'Use for borders on non-bold gray accent backgrounds.',
          },
        },
      },
    },
    background: {
      accent: {
        blue: {
          subtlest: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for blue backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.blue.subtlest.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.blue.subtlest.',
              },
            },
          },
          subtler: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for blue backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.blue.subtler.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.blue.subtler.',
              },
            },
          },
          subtle: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for vibrant blue backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.blue.subtle.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.blue.subtle.',
              },
            },
          },
          bolder: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for blue backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.blue.bolder.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.blue.bolder.',
              },
            },
          },
        },
        red: {
          subtlest: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for red backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.red.subtlest.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.red.subtlest.',
              },
            },
          },
          subtler: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for red backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.red.subtler.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.red.subtler.',
              },
            },
          },
          subtle: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for vibrant red backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.red.subtle.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.red.subtle.',
              },
            },
          },
          bolder: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for red backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.red.bolder.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.red.bolder.',
              },
            },
          },
        },
        orange: {
          subtlest: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for orange backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.orange.subtlest.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.orange.subtlest.',
              },
            },
          },
          subtler: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for orange backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.orange.subtler.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.orange.subtler.',
              },
            },
          },
          subtle: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for vibrant orange backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.orange.subtle.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.orange.subtle.',
              },
            },
          },
          bolder: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for orange backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.orange.bolder.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.orange.bolder.',
              },
            },
          },
        },
        yellow: {
          subtlest: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for yellow backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.yellow.subtlest.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.yellow.subtlest.',
              },
            },
          },
          subtler: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for yellow backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.yellow.subtler.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.yellow.subtler.',
              },
            },
          },
          subtle: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for vibrant yellow backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.yellow.subtle.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.yellow.subtle.',
              },
            },
          },
          bolder: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for yellow backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.yellow.bolder.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.yellow.bolder.',
              },
            },
          },
        },
        green: {
          subtlest: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for green backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.green.subtlest.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.green.subtlest.',
              },
            },
          },
          subtler: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for green backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.green.subtler.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.green.subtler.',
              },
            },
          },
          subtle: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for vibrant green backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.green.subtle.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.green.subtle.',
              },
            },
          },
          bolder: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for green backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.green.bolder.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.green.bolder.',
              },
            },
          },
        },
        teal: {
          subtlest: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for teal backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.teal.subtlest.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.teal.subtlest.',
              },
            },
          },
          subtler: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for teal backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.teal.subtler.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.teal.subtler.',
              },
            },
          },
          subtle: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for vibrant teal backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.teal.subtle.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.teal.subtle.',
              },
            },
          },
          bolder: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for teal backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.teal.bolder.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.teal.bolder.',
              },
            },
          },
        },
        purple: {
          subtlest: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for purple backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.purple.subtlest.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.purple.subtlest.',
              },
            },
          },
          subtler: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for purple backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.purple.subtler.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.purple.subtler.',
              },
            },
          },
          subtle: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for vibrant purple backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.purple.subtle.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.purple.subtle.',
              },
            },
          },
          bolder: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for purple backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.purple.bolder.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.purple.bolder.',
              },
            },
          },
        },
        magenta: {
          subtlest: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for magenta backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.magenta.subtlest.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.magenta.subtlest.',
              },
            },
          },
          subtler: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for magenta backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.magenta.subtler.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.magenta.subtler.',
              },
            },
          },
          subtle: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for vibrant magenta backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.magenta.subtle.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.magenta.subtle.',
              },
            },
          },
          bolder: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for magenta backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.magenta.bolder.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.magenta.bolder.',
              },
            },
          },
        },
        lime: {
          subtlest: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.6.0',
                description:
                  'Use for for backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.lime.subtlest.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.lime.subtlest.',
              },
            },
          },
          subtler: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.6.0',
                description:
                  'Use for for backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.lime.subtler.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.lime.subtler.',
              },
            },
          },
          subtle: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.6.0',
                description:
                  'Use for vibrant for backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.lime.subtle.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.lime.subtle.',
              },
            },
          },
          bolder: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.6.0',
                description:
                  'Use for for backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.lime.bolder.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.lime.bolder.',
              },
            },
          },
        },
        gray: {
          subtlest: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for gray backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.gray.subtlest.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.gray.subtlest.',
              },
            },
          },
          subtler: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for gray backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.gray.subtler.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.gray.subtler.',
              },
            },
          },
          subtle: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for vibrant gray backgrounds when there is no meaning tied to the color, such as colored tags.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.gray.subtle.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.gray.subtle.',
              },
            },
          },
          bolder: {
            '[default]': {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '0.7.0',
                description:
                  'Use for gray backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
              },
            },
            hovered: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Hovered state of color.background.accent.gray.bolder.',
              },
            },
            pressed: {
              attributes: {
                group: 'paint',
                state: 'active',
                introduced: '1.19.0',
                description:
                  'Pressed state of color.background.accent.gray.subtlest.',
              },
            },
          },
        },
      },
    },
  },
};

export default color;
