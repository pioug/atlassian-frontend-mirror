import { NodeSpec, Node as PMNode } from 'prosemirror-model';

/**
 * @name date_node
 */
export interface DateDefinition {
  type: 'date';
  attrs: {
    /**
     * @minLength 1
     */
    timestamp: string;
  };
}

export const date: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: true,
  attrs: {
    timestamp: { default: '' },
  },
  parseDOM: [
    {
      tag: 'span[data-node-type="date"]',
      getAttrs: dom => ({
        timestamp: (dom as HTMLElement).getAttribute('data-timestamp'),
      }),
    },
  ],
  toDOM(node: PMNode) {
    const attrs = {
      'data-node-type': 'date',
      'data-timestamp': node.attrs.timestamp,
    };
    return ['span', attrs];
  },
};
