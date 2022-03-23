import type { AttributeSchema, SurfaceTokenSchema } from '../../../types';

const shadow: AttributeSchema<SurfaceTokenSchema> = {
  elevation: {
    surface: {
      '[default]': {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description: 'Use as the primary background for the UI.',
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
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description:
            'Use for the background of raised cards, such as Jira cards on a Kanban board. Combine with elevation.shadow.raised',
        },
      },
      overlay: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.6.0',
          description: `Use for the background of elements that sit on top of they UI, such as modals, dropdown menus, flags, and inline dialogs. Combine with elevation.shadow.overlay

Also use for the background of raised cards in a dragged state.`,
        },
      },
    },
  },
};

export default shadow;
