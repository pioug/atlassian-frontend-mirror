import { NodeSpec, Node as PMNode } from 'prosemirror-model';
import { uuid } from '../../utils/uuid';
import { getExtensionAttrs } from '../../utils/extensions';
import { ExtensionAttributes } from './types/extensions';

/**
 * @name inlineExtension_node
 */
export interface InlineExtensionDefinition {
  type: 'inlineExtension';
  attrs: Omit<ExtensionAttributes, 'layout'>;
}

const createInlineExtensionNodeSpec = (
  allowLocalId: boolean = false,
): NodeSpec => {
  const nodeSpec: NodeSpec = {
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
        getAttrs: domNode =>
          getExtensionAttrs(domNode as HTMLElement, allowLocalId, true),
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

  if (allowLocalId && nodeSpec.attrs) {
    nodeSpec.attrs.localId = { default: uuid.generate() };
  }

  return nodeSpec;
};

export const inlineExtension = createInlineExtensionNodeSpec();
export const inlineExtensionWithLocalId = createInlineExtensionNodeSpec(true);
