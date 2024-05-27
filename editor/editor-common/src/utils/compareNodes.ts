import {
  type CardAttributes,
  type DateDefinition,
  type MentionAttributes,
  type StatusDefinition,
  type UrlType,
} from '@atlaskit/adf-schema';
import { type Mark, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { SortOrder } from '../types';

export enum ContentType {
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

type NormalizeTextParser = (text: string) => string | number | null;

function getLinkMark(node: PMNode): Mark | null {
  const [linkMark] = node.marks.filter((mark) => mark.type.name === 'link');
  return linkMark || null;
}

function parseLocaleNumber(
  stringNumber: string,
  groupPattern: RegExp,
  fractionPattern: RegExp,
): number | null {
  if (!stringNumber.trim().length) {
    return null;
  }

  const maybeANumber = Number.parseFloat(
    stringNumber.replace(groupPattern, '').replace(fractionPattern, '.'),
  );

  if (Number.isNaN(maybeANumber)) {
    return null;
  }

  return maybeANumber;
}

export function createNormalizeTextParser(): NormalizeTextParser {
  // Source: https://stackoverflow.com/questions/12004808/does-javascript-take-local-decimal-separators-into-account
  const locale = window.navigator.language;
  const thousandSeparator = Intl.NumberFormat(locale)
    .format(11111)
    .replace(/\p{Number}/gu, '');
  const decimalSeparator = Intl.NumberFormat(locale)
    .format(1.1)
    .replace(/\p{Number}/gu, '');

  const numericPattern = new RegExp(
    `(\\d+(?:[${thousandSeparator}${decimalSeparator}]?\\d+)*)`,
    'g',
  );
  const thousandSeparatorPattern = new RegExp('\\' + thousandSeparator, 'g');
  const decimalSeparatorPattern = new RegExp('\\' + decimalSeparator);

  return (text: string) => {
    if (!text.trim().length) {
      return null;
    }

    // This will break the text apart at the locations of the formatted numbers
    const result = text.split(numericPattern);

    // We then put the text back together but with all the formatted numbers converted back to plain numerals,
    // for example a sentence like "What is 1,000.01% of 10,000.01" would be normalized and sorted as
    // if it's saying "What is 1000.01% of 10000.01". This way the Intl.Collator can use the numeric setting to sort
    // numeral values within string correctly.
    const tokens = result.reduce<(string | number)[]>((acc, stringNumber) => {
      if (!stringNumber?.length) {
        return acc;
      }
      const maybeANumber = parseLocaleNumber(
        stringNumber,
        thousandSeparatorPattern,
        decimalSeparatorPattern,
      );

      // NOTE: We know there can only be a single decimal separator. So we can assume that if the first found separator
      // is not at the same position as the last found one, then we can assume the locale used to format the number
      // is different to our locale. This will result in the value being treated as a string.
      if (
        maybeANumber !== null &&
        stringNumber.indexOf(decimalSeparator) ===
          stringNumber.lastIndexOf(decimalSeparator)
      ) {
        acc.push(maybeANumber);
      } else {
        acc.push(stringNumber);
      }

      return acc;
    }, []);

    if (tokens.length === 1) {
      return tokens[0];
    }

    return tokens.join('');
  };
}

export function extractMetaFromTextNode(
  textNode: PMNode,
  normalizeTextParser: NormalizeTextParser,
): NodeMeta {
  // treat as a link if contain a link
  const linkMark = getLinkMark(textNode);
  if (linkMark) {
    const value = textNode.text || '';
    return {
      type: ContentType.LINK,
      value,
    };
  }

  const text = textNode.text || '';

  const normalizedText = normalizeTextParser(text);

  if (typeof normalizedText === 'number') {
    return {
      type: ContentType.NUMBER,
      value: normalizedText,
    };
  }

  return {
    type: ContentType.TEXT,
    value: normalizedText ?? text,
  };
}

function getMetaFromNode(
  node: PMNode | null,
  options: CompareOptions,
  normalizeTextParser: NormalizeTextParser,
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
      return getMetaFromNode(firstChild, options, normalizeTextParser);
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
      return extractMetaFromTextNode(firstChild, normalizeTextParser);
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

  if (typeof valueA === 'string' && typeof valueB === 'string') {
    return valueA.localeCompare(valueB, window.navigator.language, {
      caseFirst: 'upper',
      numeric: true,
    }) as 1 | 0 | -1;
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
  const normalizeTextParser = createNormalizeTextParser();
  return (nodeA: PMNode | null, nodeB: PMNode | null): number => {
    const metaNodeA = getMetaFromNode(nodeA, options, normalizeTextParser);
    const metaNodeB = getMetaFromNode(nodeB, options, normalizeTextParser);
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
