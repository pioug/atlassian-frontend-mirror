import { ParagraphDefinition as Paragraph } from '../paragraph';
import { MediaSingleDefinition as MediaSingle } from '../media-single';
import { CodeBlockDefinition as CodeBlock } from '../code-block';

export interface ListItemArray
  extends Array<
    | Paragraph
    | OrderedListDefinition
    | BulletListDefinition
    | MediaSingle
    | CodeBlock
  > {
  0: Paragraph | MediaSingle | CodeBlock;
}

/**
 * @name listItem_node
 */
export interface ListItemDefinition {
  type: 'listItem';
  /**
   * @minItems 1
   * @allowUnsupportedBlock true
   */
  content: ListItemArray;
}

/**
 * @name bulletList_node
 */
export interface BulletListDefinition {
  type: 'bulletList';
  /**
   * @minItems 1
   */
  content: Array<ListItemDefinition>;
}

/**
 * @name orderedList_node
 */
export interface OrderedListDefinition {
  type: 'orderedList';
  /**
   * @minItems 1
   */
  content: Array<ListItemDefinition>;
  attrs?: {
    /**
     * @minimum 0
     */
    order?: number;
  };
}
