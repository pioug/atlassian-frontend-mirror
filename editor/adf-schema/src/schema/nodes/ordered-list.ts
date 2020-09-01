import { NodeSpec } from 'prosemirror-model';
// eslint-disable-next-line import/no-cycle
import { ListItemDefinition as ListItemNode } from './list-item';

/**
 * @name orderedList_node
 */
export interface OrderedListDefinition {
  type: 'orderedList';
  /**
   * @minItems 1
   */
  content: Array<ListItemNode>;
  attrs?: {
    /**
     * @minimum 1
     */
    order: number;
  };
}

export const orderedListSelector = '.ak-ol';

export const orderedList: NodeSpec = {
  group: 'block',
  content: 'listItem+',
  marks: 'unsupportedMark unsupportedNodeAttribute',
  selectable: false,
  parseDOM: [{ tag: 'ol' }],
  toDOM() {
    const attrs = {
      class: orderedListSelector.substr(1),
    };
    return ['ol', attrs, 0];
  },
};
