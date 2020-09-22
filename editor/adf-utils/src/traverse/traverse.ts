import { ADFEntity, VisitorCollection, EntityParent } from '../types';

export function validateVisitors(_visitors: VisitorCollection) {
  return true;
}

/**
 * Provides recursive, depth-first search document traversal. Use visitors collection to define nodes of interest.
 * If no visitor for given node is defined, no-op happens.
 * If visitor returns new node, the old node is replaced.
 * If visitor returns false, node is dropped from the document.
 * If visitor returns null/undefined/void, original node is used.
 * @param adf Document to traverse.
 * @param visitors Collection of visitors.
 */
export function traverse(adf: ADFEntity, visitors: VisitorCollection) {
  if (!validateVisitors(visitors)) {
    throw new Error(
      `Visitors are not valid: "${Object.keys(visitors).join(', ')}"`,
    );
  }

  return traverseNode(adf, { node: undefined }, visitors, 0, 0);
}

function traverseNode(
  adfNode: ADFEntity,
  parent: EntityParent,
  visitors: VisitorCollection,
  index: number,
  depth: number,
): ADFEntity | false {
  const visitor = visitors[adfNode.type] || visitors['any'];

  let newNode = { ...adfNode };
  if (visitor) {
    const processedNode = visitor({ ...newNode }, parent, index, depth);

    if (processedNode === false) {
      return false;
    }

    newNode = processedNode || adfNode;
  }

  if (newNode.content) {
    newNode.content = newNode.content.reduce<Array<ADFEntity>>(
      (acc, node, idx) => {
        if (!node) {
          return acc;
        }
        const processedNode = traverseNode(
          node,
          { node: newNode, parent },
          visitors,
          idx,
          depth + 1,
        );
        if (processedNode !== false) {
          acc.push(processedNode);
        }
        return acc;
      },
      [],
    );
  }

  return newNode;
}
