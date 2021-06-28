import {
  Fragment,
  Node as PMNode,
  Mark,
  NodeType,
  Schema,
} from 'prosemirror-model';
import { default as encodeCxhtml } from './encode-cxhtml';
import { children } from './utils';

export const docContentWrapper = (
  schema: Schema,
  content: Fragment,
  convertedNodesReverted: WeakMap<Fragment | PMNode, Node>,
) => {
  const validContent = (node: PMNode) => {
    if (node.type.spec.group === 'block') {
      return true;
    }
    return false;
  };
  // For doc we want to convert all UnsupportedInline to UnsupportedBlock
  const blockContent: PMNode[] = [];
  content.forEach((node: PMNode) => {
    if (node.type === schema.nodes.confluenceUnsupportedInline) {
      const unsupportedBlock: PMNode = schema.nodes.confluenceUnsupportedBlock.createChecked(
        {
          cxhtml: node.attrs.cxhtml,
        },
      );
      blockContent.push(unsupportedBlock);
      return;
    }
    blockContent.push(node);
  });
  return ensureBlock(
    schema,
    Fragment.fromArray(blockContent),
    convertedNodesReverted,
    validContent,
  );
};

/**
 * @param content
 * @param convertedNodesReverted
 * Bullet List and Ordered List can only accept listItems
 */
export const listContentWrapper = (
  schema: Schema,
  content: Fragment,
  convertedNodesReverted: WeakMap<Fragment | PMNode, Node>,
) => {
  const result: PMNode[] = [];

  content.forEach((node: PMNode) => {
    if (node.type !== schema.nodes.listItem) {
      const listItemContent = listItemContentWrapper(
        schema,
        Fragment.from(node),
        convertedNodesReverted,
      );
      const listItem = schema.nodes.listItem.createChecked({}, listItemContent);
      result.push(listItem);
    } else {
      result.push(node);
    }
  });

  return Fragment.fromArray(result);
};

/**
 * @param node
 * @param convertedNodesReverted
 * A private method that used by listItemContentWrapper and blockquoteContentWrapper
 * to wrap invalid content in a paragraph
 */
const convertInvalidToParagraph = (
  schema: Schema,
  node: PMNode,
  convertedNodesReverted: WeakMap<Fragment | PMNode, Node>,
) => {
  const paragraphContent = ensureInline(
    schema,
    Fragment.from(node),
    convertedNodesReverted,
  );
  const paragraph = schema.nodes.paragraph.createChecked({}, paragraphContent);
  return paragraph;
};

/**
 * @param content
 * @param convertedNodesReverted
 * ListItem content schema 'paragraph (paragraph | bulletList | orderedList)*'
 */
export const listItemContentWrapper = (
  schema: Schema,
  content: Fragment,
  convertedNodesReverted: WeakMap<Fragment | PMNode, Node>,
) => {
  const validSpec: NodeType[] = [
    schema.nodes.paragraph,
    schema.nodes.bulletList,
    schema.nodes.orderedList,
  ];
  const validContent = (node: PMNode) => {
    if (
      validSpec.some((spec: NodeType) => {
        return spec === node.type;
      })
    ) {
      return true;
    }
    return false;
  };
  const convertInvalid = (node: PMNode) => {
    return convertInvalidToParagraph(schema, node, convertedNodesReverted);
  };
  return ensureBlock(
    schema,
    content,
    convertedNodesReverted,
    validContent,
    convertInvalid,
  );
};

/**
 * @param content
 * @param convertedNodesReverted
 * blockquote schema supports one or more number of paragraph nodes
 */
export const blockquoteContentWrapper = (
  schema: Schema,
  content: Fragment,
  convertedNodesReverted: WeakMap<Fragment | PMNode, Node>,
) => {
  const validSpec: NodeType[] = [schema.nodes.paragraph];
  const validContent = (node: PMNode) => {
    if (
      validSpec.some((spec: NodeType) => {
        return spec === node.type;
      })
    ) {
      return true;
    }
    return false;
  };
  const convertInvalid = (node: PMNode) => {
    return convertInvalidToParagraph(schema, node, convertedNodesReverted);
  };
  return ensureBlock(
    schema,
    content,
    convertedNodesReverted,
    validContent,
    convertInvalid,
  );
};

/**
 * @param content
 * @param convertedNodesReverted
 * This function will convert all content to inline nodes
 */
export const ensureInline = (
  schema: Schema,
  content: Fragment,
  convertedNodesReverted: WeakMap<Fragment | PMNode, Node>,
  supportedMarks?: Mark[],
) => {
  const result: PMNode[] = [];
  content.forEach((node: PMNode) => {
    if (node.isInline) {
      const filteredMarks = node.marks.filter(
        (mark) => !supportedMarks || mark.isInSet(supportedMarks),
      );
      result.push(node.mark(filteredMarks));
      return;
    }
    // We replace an non-inline node with UnsupportedInline node
    const originalNode =
      convertedNodesReverted.get(node) || convertedNodesReverted.get(content);
    const unsupportedInline: PMNode = schema.nodes.confluenceUnsupportedInline.createChecked(
      {
        cxhtml: originalNode ? encodeCxhtml(originalNode) : '',
      },
    );
    result.push(unsupportedInline);
  });
  return Fragment.fromArray(result);
};

/**
 * Ensure that each node in the fragment is valid block, wrapping
 * in a block node if necessary. You pass in a
 * validContent to skip some of the content type
 * Optionaly, you can decide to how to convert invalid node
 */
export function ensureBlock(
  schema: Schema,
  content: Fragment,
  convertedNodesReverted: WeakMap<Fragment | PMNode, Node>,
  validContent: (node: PMNode) => boolean,
  convertInvalid?: (node: PMNode) => PMNode,
): Fragment {
  // This algorithm is fairly simple:
  //
  // 1. If validContent(node) => true, keep it as-is.
  // 2. When a sequence of supported (i.e. *not* `unsupportedInline`) inlines is encountered,
  //    wrap it in a paragraph.
  // 3. When an invalid block node is encountered, convert it with convertInvalid()
  //
  // It's seems possible for CXHTML documents to be poorly formed, where inline content exists
  // in positions where block content is expected. For example the top-level content is not wrapped
  // in a paragraph, but is expected to be a top-level block node.
  //
  //     Foo bar baz
  //
  // In this scenario it's effectively wrapped in a paragraph:
  //
  //     <p>Foo bar baz</p>
  //
  // This is more common in places like list items, or block quotes:
  //
  //     <ul>
  //       <li>Foo bar</li>
  //     </ul>
  //     <blockquote>Foo bar</blockquote>
  //
  // Both `<li>` (`listItem`) and `<blockquote>` (`blockQuote`) expect *paragraph* content, and so
  // in both cases `Foo bar` is wrapped in a paragraph.
  const nodes = children(content);
  const blocks: PMNode[] = [];
  const defaultConvertInvalid = (node: PMNode) => {
    const originalNode =
      convertedNodesReverted.get(node) || convertedNodesReverted.get(content);
    const unsupportedBlock: PMNode = schema.nodes.confluenceUnsupportedBlock.createChecked(
      {
        cxhtml: originalNode ? encodeCxhtml(originalNode) : '',
      },
    );
    return unsupportedBlock;
  };

  let i: number;
  for (i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (validContent(node)) {
      blocks.push(node);
    } else if (node.isInline) {
      // An inline node is found. Now step through until we find the last inline
      // node, then throw everything in a paragraph.
      let j = i + 1;
      for (j; j < nodes.length; j++) {
        const nextNode = nodes[j];
        if (nextNode.isBlock) {
          break;
        }
      }
      blocks.push(schema.nodes.paragraph.createChecked({}, nodes.slice(i, j)));
      i = j - 1;
    } else {
      // This is an block node but invalid content
      blocks.push(
        convertInvalid ? convertInvalid(node) : defaultConvertInvalid(node),
      );
    }
  }

  return Fragment.fromArray(blocks);
}
