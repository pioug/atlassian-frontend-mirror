import { NodeSpec } from 'prosemirror-model';

const name = 'confluenceUnsupportedBlock';

export const confluenceUnsupportedBlock: NodeSpec = {
  group: 'block',
  attrs: { cxhtml: { default: null } },
  toDOM(node) {
    // NOTE: This node cannot be "contenteditable: false". If it's the only node in a document, PM throws an error because there's nowhere to put the cursor.
    const attrs = {
      'data-node-type': name,
      'data-confluence-unsupported': 'block',
      'data-confluence-unsupported-block-cxhtml': node.attrs['cxhtml'],
    };
    return ['div', attrs, 'Unsupported content'];
  },
  parseDOM: [
    {
      tag: `div[data-node-type="${name}"]`,
      getAttrs(dom) {
        return {
          cxhtml: (dom as HTMLElement).getAttribute(
            'data-confluence-unsupported-block-cxhtml',
          )!,
        };
      },
    },
  ],
};
