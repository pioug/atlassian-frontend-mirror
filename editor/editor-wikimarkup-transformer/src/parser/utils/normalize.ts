import { Node as PMNode, Schema } from 'prosemirror-model';
import {
  createParagraphNodeFromInlineNodes,
  createEmptyParagraphNode,
} from '../nodes/paragraph';

export function normalizePMNodes(nodes: PMNode[], schema: Schema): PMNode[] {
  return [normalizeMediaGroups, normalizeInlineNodes].reduce(
    (currentNodes, normFunc) => normFunc(currentNodes, schema),
    nodes,
  );
}

export function normalizeInlineNodes(
  nodes: PMNode[],
  schema: Schema,
): PMNode[] {
  const output: PMNode[] = [];
  let inlineNodeBuffer: PMNode[] = [];
  for (const node of nodes) {
    if (!node.isBlock) {
      inlineNodeBuffer.push(node);
      continue;
    }
    const trimedInlineNodes = trimInlineNodes(inlineNodeBuffer);
    if (trimedInlineNodes.length > 0) {
      output.push(
        ...createParagraphNodeFromInlineNodes(trimedInlineNodes, schema),
      );
    }
    inlineNodeBuffer = []; // clear buffer
    output.push(node);
  }
  const trimedInlineNodes = trimInlineNodes(inlineNodeBuffer);
  if (trimedInlineNodes.length > 0) {
    output.push(
      ...createParagraphNodeFromInlineNodes(trimedInlineNodes, schema),
    );
  }
  if (output.length === 0) {
    return [createEmptyParagraphNode(schema)];
  }
  return output;
}

/**
 * Normalize the list of the given nodes for media groups.
 * The rule is: if there are consecutive media group nodes (each with a single child media
 * node) separated by any space or a single newline, then merge them into one media group
 * with multiple child media nodes.
 * @param nodes list of nodes to normalize. Must not be null
 * @param schema
 */
function normalizeMediaGroups(nodes: PMNode[], schema: Schema): PMNode[] {
  const output: PMNode[] = [];
  let mediaGroupBuffer: PMNode[] = [];
  let separatorBuffer: PMNode[] = [];
  for (const n of nodes) {
    if (n.type.name === 'mediaGroup' && n.childCount === 1) {
      mediaGroupBuffer.push(n);
      //separator buffer keeps track of the seperator(s) between each mediaGroup nodes,
      //so needs resetting every time we encounter a new mediaGroup node
      separatorBuffer = [];
      continue;
    }
    if (mediaGroupBuffer.length > 0) {
      if (isSignificantSeparatorNode(n, separatorBuffer)) {
        output.push(createMergedMediaGroup(mediaGroupBuffer, schema));
        output.push(n);
        mediaGroupBuffer = [];
        separatorBuffer = [];
      } else {
        separatorBuffer.push(n);
      }
      continue;
    }
    output.push(n);
  }
  if (mediaGroupBuffer.length > 0) {
    output.push(createMergedMediaGroup(mediaGroupBuffer, schema));
  }
  return output;
}

/**
 * Creates a single mediaGroup whose children are the single media elements from the given mediaGroupNodes.
 * @param mediaGroupNodes list of mediaGroups that have a single child each
 * @param schema the schema
 */
function createMergedMediaGroup(
  mediaGroupNodes: PMNode[],
  schema: Schema,
): PMNode {
  const { mediaGroup } = schema.nodes;
  const mediaNodes: PMNode[] = mediaGroupNodes.map(v => v.child(0));
  return mediaGroup.createChecked({}, mediaNodes);
}

function isSignificantSeparatorNode(
  n: PMNode,
  separatorBuffer: PMNode[],
): boolean {
  return (
    isHardBreak(n, separatorBuffer) ||
    !isEmptyTextNode(n) ||
    isMediaGroupWithMultipleChildren(n)
  );
}
/**
 * Existing media groups with more than one child is considered as a significant separator.
 */
function isMediaGroupWithMultipleChildren(n: PMNode): boolean {
  return n.type.name === 'mediaGroup' && n.childCount > 1;
}

/**
 * If the current node is a hard break, AND there's already at least
 * one hard break in the separator buffer, then we want to return true.
 * @param n the current node to examine
 * @param separatorBuffer the existing separator buffer.
 */
function isHardBreak(n: PMNode, separatorBuffer: PMNode[]): boolean {
  return (
    n.type.name === 'hardBreak' &&
    separatorBuffer.map(v => v.type.name).indexOf('hardBreak') !== -1
  );
}

function isEmptyTextNode(n: PMNode): boolean {
  return n.textContent !== undefined && n.textContent.trim().length === 0;
}

/**
 * Remove leading and trailing hardBreak
 */
function trimInlineNodes(nodes: PMNode[]) {
  let leadingNode = nodes.shift();
  while (leadingNode) {
    if (leadingNode.type.name !== 'hardBreak') {
      nodes.unshift(leadingNode);
      break;
    }
    leadingNode = nodes.shift();
  }

  let trailingNode = nodes.pop();
  while (trailingNode) {
    if (trailingNode.type.name !== 'hardBreak') {
      nodes.push(trailingNode);
      break;
    }
    trailingNode = nodes.pop();
  }

  return nodes;
}

export function isNextLineEmpty(input: string) {
  // Line with only spaces is considered an empty line
  return input.trim().length === 0;
}
