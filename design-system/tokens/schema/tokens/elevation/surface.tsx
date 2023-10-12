import type { AttributeSchema, SurfaceTokenSchema } from '../../../src/types';
import type { BaseToken } from '../../palettes/palette';

const surface: AttributeSchema<SurfaceTokenSchema<BaseToken>> = {
  elevation: {
    surface: {
      '[default]': {
        '[default]': {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description: 'Use as the primary background for the UI.',
          },
        },
        hovered: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.10.20',
            description: 'Hovered state of elevation.surface',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.10.20',
            description: 'Pressed state of elevation.surface',
          },
        },
      },
      sunken: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'A secondary background for the UI commonly used for grouping items, such as Jira cards in columns.',
        },
      },
      raised: {
        '[default]': {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description:
              'Use for the background of cards that can be moved, such as Jira cards on a Kanban board. Combine with elevation.shadow.raised.',
          },
        },
        hovered: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.10.20',
            description: 'Hovered state of elevation.surface.raised',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.10.20',
            description: 'Pressed state of elevation.surface.raised',
          },
        },
      },
      overlay: {
        '[default]': {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.6.0',
            description: `Use for the background of elements that sit on top of they UI, such as modals, dialogs, dropdown menus, floating toolbars, and floating single-action buttons. Also use for the background of raised cards in a dragged state. Combine with elevation.shadow.overlay.`,
          },
        },
        hovered: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.10.20',
            description: `Hovered state of elevation.surface.overlay`,
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.10.20',
            description: `Pressed state of elevation.surface.overlay`,
          },
        },
      },
    },
  },
};

export default surface;
