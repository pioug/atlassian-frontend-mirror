import { NodeSpec, Node as PMNode } from 'prosemirror-model';
import { getExtensionAttrs } from '../../utils/extensions';
import { InlineExtensionAttributes } from './types/extensions';
import { MarksObject } from './types/mark';
import { DataConsumerDefinition } from '../marks/data-consumer';
import { FragmentDefinition } from '../marks/fragment';

/**
 * @name inlineExtension_node
 */
export interface InlineExtensionBaseDefinition {
  type: 'inlineExtension';
  attrs: InlineExtensionAttributes;
  marks?: Array<any>;
}

/**
 * @name inlineExtension_with_marks_node
 */
export type InlineExtensionDefinition = InlineExtensionBaseDefinition &
  MarksObject<DataConsumerDefinition>;

/**
 * @stage 0
 * @name inlineExtension_with_experimental_marks_node
 */
export type InlineExtensionWithMarksDefinition = InlineExtensionBaseDefinition &
  MarksObject<FragmentDefinition>;

const createInlineExtensionNodeSpec = (): NodeSpec => {
  const nodeSpec: NodeSpec = {
    inline: true,
    group: 'inline',
    selectable: true,
    attrs: {
      extensionType: { default: '' },
      extensionKey: { default: '' },
      parameters: { default: null },
      text: { default: null },
      localId: { default: null },
    },
    parseDOM: [
      {
        tag: 'span[data-extension-type]',
        getAttrs: (domNode) => getExtensionAttrs(domNode as HTMLElement, true),
      },
    ],
    toDOM(node: PMNode) {
      const attrs = {
        'data-extension-type': node.attrs.extensionType,
        'data-extension-key': node.attrs.extensionKey,
        'data-text': node.attrs.text,
        'data-parameters': JSON.stringify(node.attrs.parameters),
        'data-local-id:': node.attrs.localId,
        contenteditable: 'false',
      };
      return ['span', attrs];
    },
  };

  return nodeSpec;
};

export const inlineExtension = createInlineExtensionNodeSpec();
