import { Node, NodeSpec } from 'prosemirror-model';
import { uuid } from '../../utils/uuid';
import { Inline } from './types/inline-content';

/**
 * @name decisionItem_node
 */
export interface DecisionItemDefinition {
  type: 'decisionItem';
  /**
   * @allowUnsupportedInline true
   */
  content?: Array<Inline>;
  attrs: {
    localId: string;
    state: string;
  };
}

export const decisionItem: NodeSpec = {
  content: 'inline*',
  defining: true,
  marks: '_',
  attrs: {
    localId: { default: '' },
    state: { default: 'DECIDED' },
  },
  parseDOM: [
    {
      tag: 'li[data-decision-local-id]',

      // Default priority is 50. We normally don't change this but since this node type is
      // also used by list-item we need to make sure that we run this parser first.
      priority: 100,

      getAttrs: (dom) => ({
        localId: uuid.generate(),
        state: (dom as HTMLElement).getAttribute('data-decision-state')!,
      }),
    },
  ],
  toDOM(node: Node) {
    const { localId, state } = node.attrs;
    const attrs = {
      'data-decision-local-id': localId || 'local-decision',
      'data-decision-state': state,
    };
    return ['li', attrs, 0];
  },
};
