import { Node as PMNode, NodeSpec } from 'prosemirror-model';
import { PanelDefinition as Panel } from './panel';
import { ParagraphDefinition as Paragraph } from './paragraph';
import { BlockQuoteDefinition as Blockquote } from './blockquote';
import { OrderedListDefinition as OrderedList } from './ordered-list';
import { BulletListDefinition as BulletList } from './bullet-list';
import { RuleDefinition as Rule } from './rule';
import { HeadingDefinition as Heading } from './heading';
import { CodeBlockDefinition as CodeBlock } from './code-block';
import { MediaGroupDefinition as MediaGroup } from './media-group';
import { MediaSingleDefinition as MediaSingle } from './media-single';
import { DecisionListDefinition as DecisionList } from './decision-list';
import { TaskListDefinition as TaskList } from './task-list';
// eslint-disable-next-line import/no-cycle
import { TableDefinition as Table } from './tableNodes';
import { BlockCardDefinition as BlockCard } from './block-card';

export type Layout = 'default' | 'wide' | 'full-width';

/**
 * @name extension_node
 */
export interface ExtensionDefinition {
  type: 'extension';
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
    layout?: Layout;
  };
}

export const extension: NodeSpec = {
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
      getAttrs: domNode => {
        const dom = domNode as HTMLElement;
        return {
          extensionType: dom.getAttribute('data-extension-type'),
          extensionKey: dom.getAttribute('data-extension-key'),
          text: dom.getAttribute('data-text'),
          parameters: JSON.parse(dom.getAttribute('data-parameters') || '{}'),
          layout: dom.getAttribute('data-layout') || 'default',
        };
      },
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
// exclude BodiedExtension
/**
 * @name extension_content
 * @minItems 1
 * @allowUnsupportedBlock true
 */
export type ExtensionContent = Array<
  | Panel
  | Paragraph
  | Blockquote
  | OrderedList
  | BulletList
  | Rule
  | Heading
  | CodeBlock
  | MediaGroup
  | MediaSingle
  | DecisionList
  | TaskList
  | Table
  | ExtensionDefinition
  | BlockCard
>;
