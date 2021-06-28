import { Node, NodeSpec } from 'prosemirror-model';

/**
 * @name placeholder_node
 */
export interface PlaceholderDefinition {
  type: 'placeholder';
  attrs: {
    text: string;
  };
}

export const placeholder: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  marks: '',
  attrs: {
    text: { default: '' },
  },
  parseDOM: [
    {
      tag: 'span[data-placeholder]',
      getAttrs: (dom) => ({
        text:
          (dom as HTMLElement).getAttribute('data-placeholder') ||
          placeholder.attrs!.text.default,
      }),
    },
  ],
  toDOM(node: Node) {
    const { text } = node.attrs;
    const attrs = {
      'data-placeholder': text,
      // Needs to be edtiable for mobile to not close keyboard
      contenteditable: 'true',
    };
    return ['span', attrs, text];
  },
};
