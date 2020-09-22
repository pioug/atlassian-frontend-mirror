import isEqual from 'lodash/isEqual';
import { Mark as PMMark, Node as PMNode } from 'prosemirror-model';

import {
  codeBlockToJSON,
  defaultSchema,
  expandToJSON,
  linkToJSON,
  mediaSingleToJSON,
  mediaToJSON,
  mentionToJSON,
  tableToJSON,
  toJSONTableCell,
  toJSONTableHeader,
} from '@atlaskit/adf-schema';

import { markOverrideRuleFor } from './markOverrideRules';

interface Transformer<T> {
  encode(node: PMNode): T;
  parse(content: T): PMNode;
}

export type JSONNode = {
  type: string;
  attrs?: object;
  content?: Array<JSONNode | undefined>;
  marks?: any[];
  text?: string;
};

export type JSONDocNode = {
  version: number;
  type: 'doc';
  content: JSONNode[];
};

const isType = (type: string) => (node: PMNode | PMMark) =>
  node.type.name === type;

const isCodeBlock = isType('codeBlock');
const isMediaNode = isType('media');
const isMediaSingleNode = isType('mediaSingle');
const isMentionNode = isType('mention');
const isParagraph = isType('paragraph');
const isHeading = isType('heading');
const isTable = isType('table');
const isTableCell = isType('tableCell');
const isTableHeader = isType('tableHeader');
const isLinkMark = isType('link');
const isUnsupportedMark = isType('unsupportedMark');
const isUnsupportedNodeAttributeMark = isType('unsupportedNodeAttribute');
const isExpand = isType('expand');
const isNestedExpand = isType('nestedExpand');
const isUnsupportedNode = (node: PMNode) =>
  isType('unsupportedBlock')(node) || isType('unsupportedInline')(node);

const filterNull = (subject: any) => {
  return Object.keys(subject).reduce((acc, key) => {
    let current = subject[key];

    if (current === null) {
      return acc;
    }

    if (typeof current === 'object' && !Array.isArray(current)) {
      current = filterNull(current);
    }

    return { ...acc, [key]: current };
  }, {});
};

const createDocFromContent = (content: JSONNode[]): JSONDocNode => {
  return {
    version: 1,
    type: 'doc',
    content: content || [],
  };
};

const emptyDoc = createDocFromContent([
  {
    type: 'paragraph',
    content: [],
  },
]);

const toJSON = (node: PMNode): JSONNode => {
  const obj: JSONNode = { type: node.type.name };
  if (isUnsupportedNode(node)) {
    return node.attrs.originalValue;
  } else if (isMediaNode(node)) {
    obj.attrs = mediaToJSON(node).attrs;
  } else if (isMediaSingleNode(node)) {
    obj.attrs = mediaSingleToJSON(node).attrs;
  } else if (isMentionNode(node)) {
    obj.attrs = mentionToJSON(node).attrs;
  } else if (isCodeBlock(node)) {
    obj.attrs = codeBlockToJSON(node).attrs;
  } else if (isTable(node)) {
    obj.attrs = tableToJSON(node).attrs;
  } else if (isTableCell(node)) {
    obj.attrs = toJSONTableCell(node).attrs;
  } else if (isTableHeader(node)) {
    obj.attrs = toJSONTableHeader(node).attrs;
  } else if (isExpand(node) || isNestedExpand(node)) {
    obj.attrs = expandToJSON(node).attrs;
  } else if (Object.keys(node.attrs).length) {
    obj.attrs = node.attrs;
  }

  if (obj.attrs) {
    obj.attrs = filterNull(obj.attrs);
  }

  if (node.isText) {
    obj.text = node.textContent;
  } else {
    node.content.forEach((child: PMNode) => {
      obj.content = obj.content || [];
      obj.content.push(toJSON(child));
    });
  }

  if (isParagraph(node) || isHeading(node)) {
    obj.content = obj.content || [];
  }

  if (node.marks.length) {
    obj.marks = node.marks.reduce((acc: any, mark) => {
      if (isUnsupportedMark(mark)) {
        if (canOverrideMark(mark, node.marks)) {
          return acc;
        } else {
          acc.push(mark.attrs.originalValue);
          return acc;
        }
      }
      if (isUnsupportedNodeAttributeMark(mark)) {
        if (mark.attrs.type.nodeType === obj.type) {
          const nodeAttributes = getUnwrappedNodeAttributes(node, mark, obj);
          obj.attrs = { ...nodeAttributes };
        }

        if (node.marks.length === 1) {
          return;
        } else {
          return acc;
        }
      }
      if (isLinkMark(mark)) {
        acc.push(linkToJSON(mark));
        return acc;
      }
      acc.push(mark.toJSON());
      return acc;
    }, []);
  }
  return obj;
};

const canOverrideMark = (mark: PMMark, existingMarks: PMMark[]): boolean => {
  if (existingMarks.some(e => mark.attrs.originalValue.type === e.type.name)) {
    return markOverrideRuleFor(
      mark.attrs.originalValue.type,
    ).canOverrideUnsupportedMark();
  }

  return false;
};

const getUnwrappedNodeAttributes = (
  node: PMNode,
  mark: PMMark,
  obj: JSONNode,
): object | null => {
  const nodeAttributes = node.type.spec.attrs;
  const attributes = { ...mark.attrs.unsupported, ...obj.attrs };
  for (var key in obj.attrs) {
    if (obj.attrs.hasOwnProperty(key)) {
      const attribute = nodeAttributes ? nodeAttributes[key] : null;
      if (attribute) {
        if (
          attribute.default === node.attrs[key] &&
          mark.attrs.unsupported[key]
        ) {
          return { ...attributes, [key]: mark.attrs.unsupported[key] };
        }
      }
    }
  }
  return attributes;
};

export class JSONTransformer implements Transformer<JSONDocNode> {
  encode(node: PMNode): JSONDocNode {
    const content: JSONNode[] = [];

    node.content.forEach(child => {
      content.push(toJSON(child));
    });

    if (!content || isEqual(content, emptyDoc.content)) {
      return createDocFromContent([]);
    }

    return createDocFromContent(content);
  }

  private internalParse(content: JSONDocNode): PMNode {
    const doc = defaultSchema.nodeFromJSON(content);
    doc.check();
    return doc;
  }

  parse(content: JSONDocNode): PMNode {
    if (content.type !== 'doc') {
      throw new Error('Expected content format to be ADF');
    }

    if (!content.content || content.content.length === 0) {
      return this.internalParse(emptyDoc);
    }

    return this.internalParse(content);
  }

  /**
   * This method is used to encode a single node
   */
  encodeNode(node: PMNode): JSONNode {
    return toJSON(node);
  }
}
