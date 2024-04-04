import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';

// getIndexMatch finds the position of a given string within a given document, in accordance to the Confluence Annotation backend
// The document is serialised into one large string, excluding any nodes that can not have annotations (eg: emojis, media).
// Finds where the given query string is relative to the serialised partial document
export function getIndexMatch(
  doc: Node,
  schema: Schema,
  selectedText: string,
  startIndex: number,
): {
  numMatches: number;
  matchIndex: number;
  textContent: string;
  blockNodePos?: number;
} {
  let textContent = '';
  let matchIndex = 0;
  let numMatches = 0;
  let blockNodePos: number | undefined;

  doc.descendants((node: Node, pos: number) => {
    const nodeType = node.type;
    const { media } = schema.nodes;

    // Mirrors Confluence backend and doesn't construct textContent if it doesn't allow annotations
    // Don't skip media node so that block node can be defined its startIndex in within [nodeStart, nodeEnd]
    if (
      (node.isText || !nodeType.allowsMarkType(schema.marks.annotation)) &&
      nodeType !== media
    ) {
      // Note: `return true` as a parent disallowing annotations does not mean a child disallows annotations.
      // Eg: panel (invalid) > p (valid)
      return true;
    }

    const nodeStart = pos;
    const nodeEnd = nodeStart + node.nodeSize;

    if (startIndex >= nodeStart && startIndex <= nodeEnd) {
      // if it's a node block, set position to pos to indicate to the backend
      // that it's an annotation on a block node
      if (nodeType === media) {
        blockNodePos = pos;
      }
      // If the start of the annotation selection is within the current node, we scan the document for previous occurrences
      // Find the index by counting all previous instances of the selectedText in the partial textContent
      // Need to scan from start, up to `startIndex` (which includes partial of the current node)
      textContent += doc.textBetween(nodeStart, startIndex - 1);
      matchIndex = countMatches(textContent, selectedText);

      // Complete appending of the node
      textContent += doc.textBetween(startIndex, nodeEnd);
    } else {
      textContent += node.textContent;
    }

    return true;
  });

  // Count total number of matches in final text
  numMatches = countMatches(textContent, selectedText);

  return { numMatches, matchIndex, textContent, blockNodePos };
}

// countMatches finds the total number of occurrences of `query` within a given `searchString`
export function countMatches(searchString: string, query: string): number {
  if (searchString === '' || query === '') {
    return 0;
  }
  // Escape characters that would trigger as syntax in a regex query before converting to the query
  const reg = new RegExp(query.replace(/(?=[.\\+*?[^\]$(){}\|])/g, '\\'), 'g');
  return (searchString.match(reg) || []).length;
}
