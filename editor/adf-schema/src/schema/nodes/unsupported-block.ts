import { NodeSpec, Node as PMNode } from 'prosemirror-model';

export const unsupportedBlock: NodeSpec = {
  inline: false,
  group: 'block',
  atom: true,
  selectable: true,
  attrs: {
    originalValue: { default: {} },
  },
  parseDOM: [
    {
      tag: '[data-node-type="unsupportedBlock"]',
      getAttrs: dom => ({
        originalValue: JSON.parse(
          (dom as HTMLElement).getAttribute('data-original-value') || '{}',
        ),
      }),
    },
  ],
  toDOM(node: PMNode) {
    const attrs = {
      'data-node-type': 'unsupportedBlock',
      'data-original-value': JSON.stringify(node.attrs.originalValue),
    };
    return ['div', attrs, 'Unsupported content'];
  },
};
