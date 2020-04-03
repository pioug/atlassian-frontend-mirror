import { NodeSpec } from 'prosemirror-model';
import { LayoutColumnDefinition } from './layout-column';
import { BreakoutMarkDefinition } from '../marks';

/**
 * @name layoutSection_node
 */
export type LayoutSectionDefinition = {
  type: 'layoutSection';

  /**
   * @minItems 2
   * @maxItems 3
   */
  content: Array<LayoutColumnDefinition>;
  marks?: Array<BreakoutMarkDefinition>;
};

export const layoutSection: NodeSpec = {
  content: 'layoutColumn{2,3}',
  isolating: true,
  parseDOM: [
    {
      context: 'layoutSection//|layoutColumn//',
      tag: 'div[data-layout-section]',
      skip: true,
    },
    {
      tag: 'div[data-layout-section]',
    },
  ],
  toDOM() {
    const attrs = { 'data-layout-section': 'true' };
    return ['div', attrs, 0];
  },
};
