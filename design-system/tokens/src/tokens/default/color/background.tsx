import type {
  AttributeSchema,
  BackgroundColorTokenSchema,
} from '../../../types';

const color: AttributeSchema<BackgroundColorTokenSchema> = {
  color: {
    background: {
      sunken: {
        attributes: {
          group: 'paint',
          description: 'Use as a secondary background for the UI',
        },
      },
      default: {
        attributes: {
          group: 'paint',
          description: 'Use as the primary background for the UI',
        },
      },
      card: {
        attributes: {
          group: 'paint',
          description:
            'Use for the background of raised cards, such as Jira cards on a Kanban board.\nCombine with shadow.card.',
        },
      },
      overlay: {
        attributes: {
          group: 'paint',
          description: `
Use for the background of overlay elements, such as modals, dropdown menus, flags, and inline dialogs (i.e. elements that sit on top of the UI).

Also use for the background of raised cards in a dragged state.

Combine with shadow.overlay.`,
        },
      },
      selected: {
        resting: {
          attributes: {
            group: 'paint',
            description: 'Use for backgrounds of elements in a selected state',
          },
        },
        hover: {
          attributes: {
            group: 'paint',
            description: 'Hover state of background.selected',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Pressed state of background.selected',
          },
        },
      },
      blanket: {
        attributes: {
          group: 'paint',
          description:
            'Use for the screen overlay that appears with modal dialogs',
        },
      },
      disabled: {
        attributes: {
          group: 'paint',
          description: 'Use for backgrounds of elements in a disabled state',
        },
      },
      boldBrand: {
        resting: {
          attributes: {
            group: 'paint',
            description:
              'A vibrant background for small UI elements like primary buttons and bold in progress lozenges.',
          },
        },
        hover: {
          attributes: {
            group: 'paint',
            description: 'Hover state of background.boldBrand',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Pressed state of background.boldBrand',
          },
        },
      },
      subtleBrand: {
        resting: {
          attributes: {
            group: 'paint',
            description:
              'Use for subdued backgrounds of UI elements like information section messages and in progress lozenges.',
          },
        },
        hover: {
          attributes: {
            group: 'paint',
            description: 'Hover state for background.subtleBrand',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Pressed state for background.subtleBrand',
          },
        },
      },
      boldDanger: {
        resting: {
          attributes: {
            group: 'paint',
            description:
              'A vibrant background for small UI elements like danger buttons and bold removed lozenges.',
          },
        },
        hover: {
          attributes: {
            group: 'paint',
            description: 'Hover state of background.boldDanger',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Pressed state of background.boldDanger',
          },
        },
      },
      subtleDanger: {
        resting: {
          attributes: {
            group: 'paint',
            description:
              'Use for subdued backgrounds of UI elements like error section messages and removed lozenges.',
          },
        },
        hover: {
          attributes: {
            group: 'paint',
            description: 'Hover state for background.subtleDanger',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Pressed state for background.subtleDanger',
          },
        },
      },
      boldWarning: {
        resting: {
          attributes: {
            group: 'paint',
            description:
              'A vibrant background for small UI elements like warning buttons and bold moved lozenges.',
          },
        },
        hover: {
          attributes: {
            group: 'paint',
            description: 'Hover state of background.boldWarning',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Pressed state of background.boldWarning',
          },
        },
      },
      subtleWarning: {
        resting: {
          attributes: {
            group: 'paint',
            description:
              'Use for subdued backgrounds of UI elements like warning section messages and moved lozenges.',
          },
        },
        hover: {
          attributes: {
            group: 'paint',
            description: 'Hover state for background.subtleWarning',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Pressed state for background.subtleWarning',
          },
        },
      },
      boldSuccess: {
        resting: {
          attributes: {
            group: 'paint',
            description:
              'A vibrant background for small UI elements like checked toggles and bold success lozenges.',
          },
        },
        hover: {
          attributes: {
            group: 'paint',
            description: 'Hover state of background.boldSuccess',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Pressed state of background.boldSuccess',
          },
        },
      },
      subtleSuccess: {
        resting: {
          attributes: {
            group: 'paint',
            description:
              'Use for subdued backgrounds of UI elements like success section messages and success lozenges. ',
          },
        },
        hover: {
          attributes: {
            group: 'paint',
            description: 'Hover state for background.subtleSuccess',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Pressed state for background.subtleSuccess',
          },
        },
      },
      boldDiscovery: {
        resting: {
          attributes: {
            group: 'paint',
            description:
              'A vibrant background for small UI elements like onboarding buttons and bold new lozenges.',
          },
        },
        hover: {
          attributes: {
            group: 'paint',
            description: 'Hover state of background.boldDiscovery',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Pressed state of background.boldDiscovery',
          },
        },
      },
      subtleDiscovery: {
        resting: {
          attributes: {
            group: 'paint',
            description:
              'Use for subdued backgrounds of UI elements like discovery section messages and new lozenges.',
          },
        },
        hover: {
          attributes: {
            group: 'paint',
            description: 'Hover state for background.subtleDiscovery',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Pressed state for background.subtleDiscovery',
          },
        },
      },
      boldNeutral: {
        resting: {
          attributes: {
            group: 'paint',
            description:
              'A vibrant background for small UI elements like unchecked toggles and bold default lozenges.',
          },
        },
        hover: {
          attributes: {
            group: 'paint',
            description: 'Hover state of background.boldNeutral',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Pressed state of background.boldNeutral',
          },
        },
      },
      transparentNeutral: {
        hover: {
          attributes: {
            group: 'paint',
            description:
              'Hover state for UIs that don’t have a default background, such as menu items or subtle buttons.',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description:
              'Pressed state for UIs that don’t have a default background, such as menu items or subtle buttons.',
          },
        },
      },
      subtleNeutral: {
        resting: {
          attributes: {
            group: 'paint',
            description:
              'Use as the default background of UI elements like buttons, lozenges, and tags.',
          },
        },
        hover: {
          attributes: {
            group: 'paint',
            description: 'Hover state for background.subtleNeutral',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Pressed state for background.subtleNeutral',
          },
        },
      },
      subtleBorderedNeutral: {
        resting: {
          attributes: {
            group: 'paint',
            description: 'Hover state for background.subtleBorderedNeutral',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Pressed state for background.subtleBorderedNeutral',
          },
        },
      },
    },
  },
};

export default color;
