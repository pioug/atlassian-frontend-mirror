import type { AttributeSchema, ShadowTokenSchema } from '../../../src/types';
import type { BaseToken } from '../../palettes/palette';

const shadow: AttributeSchema<ShadowTokenSchema<BaseToken>> = {
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
        '[default]': {
          attributes: {
            group: 'shadow',
            state: 'active',
            introduced: '0.6.0',
            description: `Use to create a shadow when content scrolls under other content.`,
          },
        },
        spread: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.10.32',
            description:
              'Use only when elevation.shadow.overflow is not technically feasible to implement. Pair with elevation.shadow.overflow.perimeter to replicate the overflow shadow.',
          },
        },
        perimeter: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.10.32',
            description:
              'Use only when elevation.shadow.overflow is not technically feasible to implement. Pair with elevation.shadow.overflow.spread to replicate the overflow shadow.',
          },
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
