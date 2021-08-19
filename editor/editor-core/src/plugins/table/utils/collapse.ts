import { NodeType, NodeRange } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';

import { findTable } from '@atlaskit/editor-tables/utils';

/**
 * Collapses the selected table into an expand given a transaction.
 *
 * Will return undefined if it cannot determine the relevant table from a
 * selection,
 *
 * Or if wrapping it in an expand results in any errors
 *
 * @param tr
 * @returns Transaction | undefined
 */
export const collapseSelectedTable = (
  tr: Transaction,
): Transaction | undefined => {
  const selection = tr.selection;
  const schema = tr.doc.type.schema;
  const nodePos = findTable(selection);

  if (!nodePos) {
    return undefined;
  }

  const { node, pos } = nodePos;
  const $pos = tr.doc.resolve(pos);
  const expand = schema.nodes.expand as NodeType;

  const range = new NodeRange(
    $pos,
    tr.doc.resolve(pos + node.nodeSize),
    $pos.depth,
  );

  // Check if result of this transaction would result in an invalid document
  try {
    // TODO: add attrs: { __expanded: false } when it is working with new collab (CEMS-1204)
    tr.wrap(range, [{ type: expand }]).setMeta('scrollIntoView', true);
    tr.doc.check();
  } catch (err) {
    // Don't care why it failed, only that we couldn't do so without issue
    return undefined;
  }

  return tr;
};
