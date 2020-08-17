import { NodeSpec, Node as PMNode } from 'prosemirror-model';
import { uuid } from '../../utils/uuid';
import { getExtensionAttrs } from '../../utils/extensions';
import { ExtensionAttributes } from './types/extensions';
import { NonNestableBlockContent } from './types/non-nestable-block-content';

/**
 * @name bodiedExtension_node
 */
export interface BodiedExtensionDefinition {
  type: 'bodiedExtension';
  attrs: ExtensionAttributes;
  /**
   * @minItems 1
   * @allowUnsupportedBlock true
   */
  content: Array<NonNestableBlockContent>;
}

const createBodiedExtensionNodeSpec = (
  allowLocalId: boolean = false,
): NodeSpec => {
  const nodeSpec: NodeSpec = {
    inline: false,
    group: 'block',
    marks: 'link',
    content:
      '(paragraph | panel | blockquote | orderedList | bulletList | rule | heading | codeBlock | mediaGroup | mediaSingle | decisionList | taskList | table | blockCard | extension | unsupportedBlock)+',
    defining: true,
    selectable: true,
    isolating: true,
    attrs: {
      extensionType: { default: '' },
      extensionKey: { default: '' },
      parameters: { default: null },
      text: { default: null },
      layout: { default: 'default' },
    },
    parseDOM: [
      {
        context: 'bodiedExtension//',
        tag: '[data-node-type="bodied-extension"]',
        skip: true,
      },
      {
        tag: '[data-node-type="bodied-extension"]',
        getAttrs: domNode =>
          getExtensionAttrs(domNode as HTMLElement, allowLocalId),
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
      };
      return ['div', attrs, 0];
    },
  };

  if (allowLocalId && nodeSpec.attrs) {
    nodeSpec.attrs.localId = { default: uuid.generate() };
  }

  return nodeSpec;
};

export const bodiedExtension = createBodiedExtensionNodeSpec();
export const bodiedExtensionWithLocalId = createBodiedExtensionNodeSpec(true);
