import { Command } from '../types';

import { splitCellWithType } from './split-cell-with-type';
import { tableNodeTypes } from './table-node-types';

// Split a selected cell, whose rowpan or colspan is greater than one,
// into smaller cells. Use the first cell type for the new cells.
export const splitCell: Command = (state, dispatch) => {
  const nodeTypes = tableNodeTypes(state.schema);
  return splitCellWithType(({ node }) => {
    return nodeTypes[node.type.spec.tableRole];
  })(state, dispatch);
};
