import { Node as PMNode, Schema } from 'prosemirror-model';

export function createEmptyParagraphNode(schema: Schema): PMNode {
  const { paragraph } = schema.nodes;

  return paragraph.createChecked({}, []);
}

/**
 * Create paragraphs from inline nodes. Two and more
 * hardbreaks will start a new paragraph
 */
export function createParagraphNodeFromInlineNodes(
  inlineNodes: PMNode[],
  schema: Schema,
): PMNode[] {
  const { paragraph } = schema.nodes;

  const result: PMNode[] = [];
  let buffer: PMNode[] = [];
  let hardbreakBuffer: PMNode[] = [];
  for (const node of inlineNodes) {
    if (node.type.name === 'hardBreak') {
      hardbreakBuffer.push(node);
      continue;
    }

    // There are more than one hardBreaks, we should make
    // a new paragraph
    if (hardbreakBuffer.length > 1 && buffer.length > 0) {
      result.push(paragraph.createChecked({}, buffer));
      buffer = [];
      hardbreakBuffer = [];
    }
    buffer.push(...hardbreakBuffer, node);
    hardbreakBuffer = [];
  }

  if (buffer.length > 0) {
    result.push(paragraph.createChecked({}, buffer));
  }

  return result;
}
