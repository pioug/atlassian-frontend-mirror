import type { AccentColorTokenSchema, AttributeSchema } from '../../../types';

const color: AttributeSchema<AccentColorTokenSchema> = {
  color: {
    text: {
      accent: {
        blue: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for blue text on non-bold backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              description: 'Use on bold blue accent backgrounds.',
            },
          },
        },
        red: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for red text on non-bold backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              description: 'Use on bold red accent backgrounds.',
            },
          },
        },
        orange: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for orange text on non-bold backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              description: 'Use on bold orange accent backgrounds.',
            },
          },
        },
        yellow: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for yellow text on non-bold backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              description: 'Use on bold yellow accent backgrounds.',
            },
          },
        },
        green: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for green text on non-bold backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              description: 'Use on bold green accent backgrounds.',
            },
          },
        },
        purple: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for purple text on non-bold backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              description: 'Use on bold purple accent backgrounds.',
            },
          },
        },
        teal: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for teal text on non-bold backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              description: 'Use on bold teal accent backgrounds.',
            },
          },
        },
        magenta: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for megenta text on non-bold backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              description: 'Use on bold magenta accent backgrounds.',
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
            description:
              'Use for blue icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        red: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use for red icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        orange: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use for orange icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        yellow: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use for yellow icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        green: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use for green icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        purple: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use for purple icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        teal: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use for teal icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
          },
        },
        magenta: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use for magenta icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.',
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
            description:
              'Use for blue borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        red: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use for red borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        orange: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use for orange borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        yellow: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use for yellow borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        green: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use for green borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        purple: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use for purple borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        teal: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use for teal borders on non-bold backgrounds when there is no meaning tied to the color.',
          },
        },
        magenta: {
          attributes: {
            group: 'paint',
            state: 'active',
            description:
              'Use for magenta borders on non-bold backgrounds when there is no meaning tied to the color.',
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
              description:
                'Use for blue backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for blue backgrounds when there is no meaning tied to the color, such as coloured tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for vibrant blue backgrounds when there is no meaning tied to the color, such as coloured tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
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
              description:
                'Use for red backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for red backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for vibrant red backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
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
              description:
                'Use for orange backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for orange backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for vibrant orange backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
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
              description:
                'Use for yellow backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for yellow backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for vibrant yellow backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
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
              description:
                'Use for green backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for green backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for vibrant green backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
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
              description:
                'Use for teal backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for teal backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for vibrant teal backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
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
              description:
                'Use for purple backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for purple backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for vibrant purple backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
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
              description:
                'Use for magenta backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.',
            },
          },
          subtler: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for magenta backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          subtle: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for vibrant magenta backgrounds when there is no meaning tied to the color, such as colored tags.',
            },
          },
          bolder: {
            attributes: {
              group: 'paint',
              state: 'active',
              description:
                'Use for magenta backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.',
            },
          },
        },
      },
    },
  },
};

export default color;
