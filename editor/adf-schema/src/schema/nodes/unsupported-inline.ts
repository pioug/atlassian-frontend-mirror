import { NodeSpec, Node as PMNode } from 'prosemirror-model';

export const unsupportedInline: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: true,
  attrs: {
    originalValue: { default: {} },
  },
  parseDOM: [
    {
      tag: '[data-node-type="unsupportedInline"]',
      getAttrs: dom => ({
        originalValue: JSON.parse(
          (dom as HTMLElement).getAttribute('data-original-value') || '{}',
        ),
      }),
    },
  ],
  toDOM(node: PMNode) {
    const attrs = {
      'data-node-type': 'unsupportedInline',
      'data-original-value': JSON.stringify(node.attrs.originalValue),
    };
    return ['span', attrs, 'Unsupported content'];
  },
};
