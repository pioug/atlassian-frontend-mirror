import { NodeSpec } from 'prosemirror-model';

const name = 'confluenceUnsupportedInline';

export const confluenceUnsupportedInline = {
  group: 'inline',
  inline: true,
  atom: true,
  attrs: { cxhtml: { default: null } },
  toDOM(node) {
    const attrs = {
      'data-node-type': name,
      'data-confluence-unsupported': 'inline',
      'data-confluence-unsupported-inline-cxhtml': node.attrs['cxhtml'],
    };
    return ['div', attrs, 'Unsupported content'];
  },
  parseDOM: [
    {
      tag: `div[data-node-type="${name}"]`,
      getAttrs(dom) {
        return {
          cxhtml: (dom as HTMLElement).getAttribute(
            'data-confluence-unsupported-inline-cxhtml',
          )!,
        };
      },
    },
  ],
} as NodeSpec;
