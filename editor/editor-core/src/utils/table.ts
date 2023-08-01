import type { ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';

/*
  isPositionNearTableRow()
  Returns true when a sibling node, or any  of the parent's sibling
  nodes are a tableRow
 */
export function isPositionNearTableRow(
  pos: ResolvedPos,
  schema: Schema,
  direction: 'before' | 'after',
) {
  if (!schema.nodes.tableRow) {
    return false;
  }
  let doc = pos.doc;
  let resolved = pos;
  const sibling = direction === 'before' ? 'nodeBefore' : 'nodeAfter';
  while (resolved.depth > 0) {
    const siblingType = resolved[sibling]?.type;
    if (siblingType === schema.nodes.tableRow) {
      return true;
    }
    resolved = doc.resolve(resolved[direction]());
  }
  return false;
}
