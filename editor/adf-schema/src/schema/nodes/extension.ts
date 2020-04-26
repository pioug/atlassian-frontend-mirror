import { Node as PMNode, NodeSpec } from 'prosemirror-model';
import { ExtensionAttributes } from './types/extensions';
import { getExtensionAttrs } from '../../utils/extensions';

/**
 * @name extension_node
 */
export interface ExtensionDefinition {
  type: 'extension';
  attrs: ExtensionAttributes;
}

const createExtensionNodeSpec = (allowLocalId: boolean = false): NodeSpec => {
  const nodeSpec: NodeSpec = {
    inline: false,
    group: 'block',
    atom: true,
    selectable: true,
    attrs: {
      extensionType: { default: '' },
      extensionKey: { default: '' },
      parameters: { default: null },
      text: { default: null },
      layout: { default: 'default' },
    },
    parseDOM: [
      {
        tag: '[data-node-type="extension"]',
        getAttrs: domNode =>
          getExtensionAttrs(domNode as HTMLElement, allowLocalId),
      },
    ],
    toDOM(node: PMNode) {
      const attrs = {
        'data-node-type': 'extension',
        'data-extension-type': node.attrs.extensionType,
        'data-extension-key': node.attrs.extensionKey,
        'data-text': node.attrs.text,
        'data-parameters': JSON.stringify(node.attrs.parameters),
        'data-layout': node.attrs.layout,
      };
      return ['div', attrs];
    },
  };

  if (allowLocalId && nodeSpec.attrs) {
    nodeSpec.attrs.localId = { default: '' };
  }

  return nodeSpec;
};

export const extension = createExtensionNodeSpec();
export const extensionWithLocalId = createExtensionNodeSpec(true);
