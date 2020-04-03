import { NodeSpec, Node } from 'prosemirror-model';

export const image: NodeSpec = {
  group: 'inline',
  inline: true,
  attrs: {
    src: { default: '' },
    alt: { default: null },
    title: { default: null },
  },
  draggable: true,
  parseDOM: [
    {
      tag: 'img[src^="data:image/"]',
      ignore: true,
    },
    {
      tag: 'img[src]',
      getAttrs(domNode) {
        const dom = domNode as HTMLElement;
        return {
          src: dom.getAttribute('src'),
          alt: dom.getAttribute('alt'),
          title: dom.getAttribute('title'),
        };
      },
    },
  ],
  toDOM(node: Node) {
    return ['img', node.attrs];
  },
};
