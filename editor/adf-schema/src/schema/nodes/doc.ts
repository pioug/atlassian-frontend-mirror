import { NodeSpec } from 'prosemirror-model';
import { CodeBlockWithMarksDefinition as CodeBlockWithMarks } from './code-block';
import { ExpandWithBreakoutDefinition as ExpandWithBreakout } from './expand';
import { LayoutSectionDefinition as LayoutSection } from './layout-section';
import { ParagraphWithIndentationDefinition } from './paragraph';
import { BlockContent } from './types/block-content';

/**
 * @name doc_node
 */
export interface DocNode {
  version: 1;
  type: 'doc';
  /**
   * @allowUnsupportedBlock true
   */
  content: Array<
    | BlockContent
    | LayoutSection
    | CodeBlockWithMarks
    | ExpandWithBreakout
    | ParagraphWithIndentationDefinition
  >;
}

export const doc: NodeSpec = {
  content: '(block|layoutSection)+',
  marks:
    'alignment breakout dataConsumer indentation link unsupportedMark unsupportedNodeAttribute',
};
