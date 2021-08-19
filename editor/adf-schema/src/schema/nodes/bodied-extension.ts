import { NodeSpec, Node as PMNode } from 'prosemirror-model';
import { getExtensionAttrs } from '../../utils/extensions';
import { ExtensionAttributes } from './types/extensions';
import { MarksObject, NoMark } from './types/mark';
import { NonNestableBlockContent } from './types/non-nestable-block-content';
import { DataConsumerDefinition } from '../marks/data-consumer';

/**
 * @name bodiedExtension_node
 */
export interface BodiedExtensionBaseDefinition {
  type: 'bodiedExtension';
  attrs: ExtensionAttributes;
  marks?: Array<any>;
  /**
   * @minItems 1
   * @allowUnsupportedBlock true
   */
  content: Array<NonNestableBlockContent>;
}

/**
 * @name bodiedExtension_with_no_marks_node
 */
export type BodiedExtensionDefinition = BodiedExtensionBaseDefinition & NoMark;

/**
 * @name bodiedExtension_with_marks_node
 */
export type BodiedExtensionWithMarksDefinition = BodiedExtensionBaseDefinition &
  MarksObject<DataConsumerDefinition>;

const createBodiedExtensionNodeSpec = (): NodeSpec => {
  const nodeSpec: NodeSpec = {
    inline: false,
    group: 'block',
    marks: 'link dataConsumer',
    content:
      '(paragraph | panel | blockquote | orderedList | bulletList | rule | heading | codeBlock | mediaGroup | mediaSingle | decisionList | taskList | table | blockCard | extension | unsupportedBlock | embedCard)+',
    defining: true,
    selectable: true,
    isolating: true,
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
        context: 'bodiedExtension//',
        tag: '[data-node-type="bodied-extension"]',
        skip: true,
      },
      {
        tag: '[data-node-type="bodied-extension"]',
        getAttrs: (domNode) => getExtensionAttrs(domNode as HTMLElement),
      },
    ],
    toDOM(node: PMNode) {
      const attrs = {
        'data-node-type': 'bodied-extension',
        'data-extension-type': node.attrs.extensionType,
        'data-extension-key': node.attrs.extensionKey,
        'data-text': node.attrs.text,
        'data-parameters': JSON.stringify(node.attrs.parameters),
        'data-layout': node.attrs.layout,
        'data-local-id:': node.attrs.localId,
      };
      return ['div', attrs, 0];
    },
  };

  return nodeSpec;
};

export const bodiedExtension = createBodiedExtensionNodeSpec();
