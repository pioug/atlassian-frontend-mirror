import type { AttributeSchema, ShadowTokenSchema } from '../../../types';

const shadow: AttributeSchema<ShadowTokenSchema> = {
  elevation: {
    shadow: {
      raised: {
        attributes: {
          group: 'shadow',
          state: 'active',
          introduced: '0.6.0',
          description: `Use for the box shadow of raised card elements, such as Jira cards on a Kanban board. Combine with elevation.surface.raised`,
        },
      },
      overflow: {
        attributes: {
          group: 'shadow',
          state: 'active',
          introduced: '0.6.0',
          description: `Use to create a shadow when content scolls under other content.`,
        },
      },
      overlay: {
        attributes: {
          group: 'shadow',
          state: 'active',
          introduced: '0.6.0',
          description: `Use for the box shadow of elements that sit on top of the UI, such as modals, dropdown menus, flags, and inline dialogs. Combine with elevation.surface.overlay

Also use for the box shadow of raised cards in a dragged state.`,
        },
      },
    },
  },
};

export default shadow;
