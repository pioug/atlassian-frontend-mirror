import { Node as PMNode, NodeSpec } from 'prosemirror-model';
import { ExtensionAttributes } from './types/extensions';
import { getExtensionAttrs } from '../../utils/extensions';
import { MarksObject, NoMark } from './types/mark';
import { DataConsumerDefinition } from '../marks/data-consumer';

/**
 * @name extension_node
 */
export interface ExtensionBaseDefinition {
  type: 'extension';
  attrs: ExtensionAttributes;
  marks?: Array<any>;
}

/**
 * @name extension_with_no_marks_node
 */
export type ExtensionDefinition = ExtensionBaseDefinition & NoMark;

/**
 * @name extension_with_marks_node
 */
export type ExtensionWithMarksDefinition = ExtensionBaseDefinition &
  MarksObject<DataConsumerDefinition>;

const createExtensionNodeSpec = (): NodeSpec => {
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
      localId: { default: null },
    },
    parseDOM: [
      {
        tag: '[data-node-type="extension"]',
        getAttrs: (domNode) => getExtensionAttrs(domNode as HTMLElement),
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
        'data-local-id:': node.attrs.localId,
      };
      return ['div', attrs];
    },
  };

  return nodeSpec;
};

export const extension = createExtensionNodeSpec();
