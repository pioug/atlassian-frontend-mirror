import { NodeSpec, Node as PMNode } from 'prosemirror-model';

/**
 * @name inlineExtension_node
 */
export interface InlineExtensionDefinition {
  type: 'inlineExtension';
  attrs: {
    /**
     * @minLength 1
     */
    extensionKey: string;
    /**
     * @minLength 1
     */
    extensionType: string;
    parameters?: object;
    text?: string;
  };
}

export const inlineExtension: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: true,
  attrs: {
    extensionType: { default: '' },
    extensionKey: { default: '' },
    parameters: { default: null },
    text: { default: null },
  },
  parseDOM: [
    {
      tag: 'span[data-extension-type]',
      getAttrs: domNode => {
        const dom = domNode as HTMLElement;
        return {
          extensionType: dom.getAttribute('data-extension-type'),
          extensionKey: dom.getAttribute('data-extension-key'),
          text: dom.getAttribute('data-text'),
          parameters: JSON.parse(dom.getAttribute('data-parameters') || '{}'),
        };
      },
    },
  ],
  toDOM(node: PMNode) {
    const attrs = {
      'data-extension-type': node.attrs.extensionType,
      'data-extension-key': node.attrs.extensionKey,
      'data-text': node.attrs.text,
      'data-parameters': JSON.stringify(node.attrs.parameters),
      contenteditable: 'false',
    };
    return ['span', attrs];
  },
};
