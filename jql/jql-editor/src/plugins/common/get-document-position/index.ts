import { Node } from '@atlaskit/editor-prosemirror/model';

import { JQLEditorSchema } from '../../../schema';

/**
 * Accumulator object to represent the current PM document position + text position within a PM node.
 */
type NodePositionAccumulator = {
  /**
   * PM document position.
   */
  doc: number;
  /**
   * Plain text position.
   */
  text: number;
  /**
   * True when we have entered the initial block node of our document (this excludes the document node itself).
   */
  enteredInitialBlock: boolean;
};

/**
 * Recursively find the PM node which includes our text position. This method tracks the offset of PM nodes in order
 * to compute the correct document position according to the rules identified here: https://prosemirror.net/docs/guide/#doc.indexing.
 *
 * If for some reason the text position can not be found in the node then the position at which the current node ends
 * will be returned.
 *
 * @param node Node to search
 * @param parentNodePos Current document and text position within the parent when entering the current node.
 * @param textPosition Text position to find in the Prosemirror document.
 */
const enterNode = (
  node: Node,
  parentNodePos: NodePositionAccumulator,
  textPosition: number,
): NodePositionAccumulator => {
  let nodePos = { ...parentNodePos };

  const isDocNode = node.type === JQLEditorSchema.nodes.doc;

  // Enter non-leaf node
  if (!node.isLeaf && !isDocNode) {
    nodePos.doc += 1;

    if (node.isBlock) {
      if (nodePos.enteredInitialBlock) {
        // Every time we enter a block node (after the initial block),
        // we need to increment text position to account for newline char.
        nodePos.text += 1;
      }
      nodePos.enteredInitialBlock = true;
    }

    // If we've entered a new block and now have a matching node then return the current node position.
    if (nodePos.text === textPosition) {
      return nodePos;
    }

    // If text position matches last position of a node view, return its outer document position
    if (node.isAtom && textPosition === nodePos.text + node.content.size) {
      nodePos.doc += node.content.size + 1;
      nodePos.text += node.content.size;
      return nodePos;
    }
  }

  if (node.isText) {
    // If our expected text position lies within the text nodes content, then return the associated document position.
    if (
      textPosition >= nodePos.text &&
      textPosition <= nodePos.text + node.nodeSize
    ) {
      const textOffset = textPosition - nodePos.text;
      nodePos.doc += textOffset;
      nodePos.text += textOffset;
      return nodePos;
    } else {
      // Otherwise increment our accumulated document/text position
      nodePos.doc += node.nodeSize;
      nodePos.text += node.nodeSize;
    }
  }

  for (let i = 0; i < node.childCount; i++) {
    nodePos = enterNode(node.child(i), nodePos, textPosition);

    // If we have a matching node after iterating this nodes children then return the current node position.
    if (nodePos.text === textPosition) {
      return nodePos;
    }
  }

  // Exit non-leaf node
  if (!node.isLeaf && !isDocNode) {
    nodePos.doc += 1;
  }

  return nodePos;
};

/**
 * Return the Prosemirror document position that maps to the provided plain text position.
 *
 * @param doc Prosemirror document
 * @param textPosition Text position to find in the Prosemirror document.
 */
const getDocumentPosition = (doc: Node, textPosition: number) => {
  const currentPos: NodePositionAccumulator = {
    doc: 0,
    text: 0,
    enteredInitialBlock: false,
  };
  const matchingNodePos = enterNode(doc, currentPos, textPosition);
  return matchingNodePos.doc;
};

export default getDocumentPosition;
