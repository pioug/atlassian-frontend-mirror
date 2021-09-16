import type { AttributeSchema, ShadowTokenSchema } from '../../../types';

const shadow: AttributeSchema<ShadowTokenSchema> = {
  shadow: {
    card: {
      attributes: {
        group: 'shadow',
        description: `
Use for the box shadow of raised card elements, such as Jira cards on a Kanban board.

Combine with background.overlay`,
      },
    },
    overlay: {
      attributes: {
        group: 'shadow',
        description: `
Use for the box shadow of overlay elements, such as modals, dropdown menus, flags, and inline dialogs (i.e. elements that sit on top of the UI).

Also use for the box shadow of raised cards in a dragged state.

Combine with background.overlay`,
      },
    },
  },
};

export default shadow;
