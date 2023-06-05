import type { BaseToken } from '../../../palettes/palette';
import type { AccentColorTokenSchema, AttributeSchema } from '../../../types';

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
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for blue backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for blue backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for vibrant blue backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for blue backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
            },
          },
        },
        red: {
          subtlest: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for red backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for red backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for vibrant red backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for red backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
            },
          },
        },
        orange: {
          subtlest: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for orange backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for orange backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for vibrant orange backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for orange backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
            },
          },
        },
        yellow: {
          subtlest: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for yellow backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for yellow backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for vibrant yellow backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for yellow backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
            },
          },
        },
        green: {
          subtlest: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for green backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for green backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for vibrant green backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for green backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
            },
          },
        },
        teal: {
          subtlest: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for teal backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for teal backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for vibrant teal backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for teal backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
            },
          },
        },
        purple: {
          subtlest: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for purple backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for purple backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for vibrant purple backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for purple backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
            },
          },
        },
        magenta: {
          subtlest: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for magenta backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for magenta backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for vibrant magenta backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for magenta backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
            },
          },
        },
        gray: {
          subtlest: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for gray backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for gray backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for vibrant gray backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.7.0',
              description:
                'Use for gray backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
            },
          },
        },
      },
    },
  },
};

export default color;
