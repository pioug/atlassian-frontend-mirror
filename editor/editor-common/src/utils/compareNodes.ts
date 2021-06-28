import { Mark, Node as PMNode } from 'prosemirror-model';

import {
  CardAttributes,
  DateDefinition,
  MentionAttributes,
  StatusDefinition,
  UrlType,
} from '@atlaskit/adf-schema';

import { SortOrder } from '../types';

enum ContentType {
  NUMBER = 0,
  TEXT = 5,
  MENTION = 10,
  DATE = 15,
  STATUS = 20,
  LINK = 25,
}

interface CompareOptions {
  getInlineCardTextFromStore(attrs: CardAttributes): string | null; // null means that could not find the title
}

interface NodeMetaGenerator<Type, Value> {
  type: Type;
  value: Value;
}
type TextNodeMeta = NodeMetaGenerator<ContentType.TEXT, string>;
type NodeMeta =
  | TextNodeMeta
  | NodeMetaGenerator<ContentType.NUMBER, number>
  | NodeMetaGenerator<ContentType.STATUS, string>
  | NodeMetaGenerator<ContentType.DATE, number>
  | NodeMetaGenerator<ContentType.MENTION, string>
  | NodeMetaGenerator<ContentType.LINK, string>;

function getLinkMark(node: PMNode): Mark | null {
  const [linkMark] = node.marks.filter((mark) => mark.type.name === 'link');
  return linkMark || null;
}

function getMetaFromNode(
  node: PMNode | null,
  options: CompareOptions,
): NodeMeta | null {
  if (!node) {
    return null;
  }
  const firstChild = node.firstChild;
  if (!firstChild) {
    return null;
  }

  switch (firstChild.type.name) {
    // Text case
    /*
      Get Meta value from the first child if the cell is of type
        * Heading (Any cell where the text is set to a heading type)
        * Paragraph (Normal text) 
     */
    case 'heading':
    case 'paragraph': {
      return getMetaFromNode(firstChild, options);
    }
    case 'inlineCard': {
      const attrs = firstChild.attrs as CardAttributes;
      const maybeTitle = options.getInlineCardTextFromStore(attrs);
      if (maybeTitle) {
        return {
          type: ContentType.LINK,
          value: maybeTitle,
        };
      }
      const url = (attrs as UrlType).url;
      return {
        type: ContentType.LINK,
        value: url ? url : '',
      };
    }

    case 'text': {
      // treat as a link if contain a link
      const linkMark = getLinkMark(firstChild);
      if (linkMark) {
        const value = firstChild.text || '';
        return {
          type: ContentType.LINK,
          value,
        };
      }

      const text = firstChild.text || '';
      const firstEmptySpace = text.indexOf(' ');
      const firstWord =
        firstEmptySpace !== -1 ? text.substring(0, firstEmptySpace) : text;
      const maybeANumber = Number.parseFloat(firstWord);
      if (!Number.isNaN(maybeANumber)) {
        return {
          type: ContentType.NUMBER,
          value: maybeANumber,
        };
      }
      return {
        type: ContentType.TEXT,
        value: firstWord,
      };
    }
    case 'status': {
      const text = (firstChild.attrs as StatusDefinition['attrs']).text;
      return {
        type: ContentType.STATUS,
        value: text,
      };
    }
    case 'date': {
      const timestamp = Number.parseInt(
        (firstChild.attrs as DateDefinition['attrs']).timestamp,
        20,
      );
      return {
        type: ContentType.DATE,
        value: timestamp,
      };
    }
    case 'mention': {
      // TODO: Check what should be the fallback when mention does not have a text
      const text = (firstChild.attrs as MentionAttributes).text || '';
      return {
        type: ContentType.MENTION,
        value: text.toLowerCase(),
      };
    }
    default:
      return null;
  }
}

function compareValue(
  valueA: string | number,
  valueB: string | number,
): 1 | 0 | -1 {
  if (valueA === valueB) {
    return 0;
  }

  return valueA > valueB ? 1 : -1;
}

/**
 * Compare 2 prosemirror nodes and check if it's greater, equal or less than the other node
 * based on the sort order.
 *
 * @param {Node} nodeA
 * @param {Node} nodeB
 * @returns {(1 | 0 | -1)}
 *
 * For Ascending order:
 *    1  -> NodeA > NodeB
 *    0  -> NodeA === NodeB
 *    -1 -> Node A < NodeB
 * For Descending order:
 *   1  -> NodeA < NodeB
 *   0  -> NodeA === NodeB
 *   -1 -> Node A > NodeB
 *
 * If either node is empty:
 * The empty node is always treated as lower priority,
 * irrespective of the order.
 *
 * If no order is provided the method defaults to Ascending order,
 * like a regular JS sort method.
 */
export const createCompareNodes = (
  options: CompareOptions,
  order: SortOrder = SortOrder.ASC,
): Function => {
  return (nodeA: PMNode | null, nodeB: PMNode | null): number => {
    const metaNodeA = getMetaFromNode(nodeA, options);
    const metaNodeB = getMetaFromNode(nodeB, options);
    /*  
      Donot switch the order (Asec or Desc) if either node is null. 
      This will ensure that empty cells are always at the bottom during sorting.
    */
    if (metaNodeA === null || metaNodeB === null) {
      return compareMetaFromNode(metaNodeA, metaNodeB);
    }
    return (
      (order === SortOrder.DESC ? -1 : 1) *
      compareMetaFromNode(metaNodeA, metaNodeB)
    );
  };
};

function compareMetaFromNode(
  metaNodeA: NodeMeta | null,
  metaNodeB: NodeMeta | null,
): number {
  if (metaNodeA === metaNodeB) {
    return 0;
  }

  if (metaNodeA === null || metaNodeB === null) {
    return metaNodeB === null ? -1 : 1;
  }

  if (metaNodeA.type !== metaNodeB.type) {
    return metaNodeA.type > metaNodeB.type ? 1 : -1;
  }

  return compareValue(metaNodeA.value, metaNodeB.value);
}
