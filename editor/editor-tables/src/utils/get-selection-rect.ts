import { Selection } from 'prosemirror-state';

import { Rect, TableMap } from '../table-map';

import { isSelectionType } from './is-selection-type';

// Get the selection rectangle. Returns `undefined` if selection is not a CellSelection.
export const getSelectionRect = (selection: Selection): Rect | undefined => {
  if (!isSelectionType(selection, 'cell')) {
    return;
  }

  const start = selection.$anchorCell.start(-1);
  const map = TableMap.get(selection.$anchorCell.node(-1));

  return map.rectBetween(
    selection.$anchorCell.pos - start,
    selection.$headCell.pos - start,
  );
};
