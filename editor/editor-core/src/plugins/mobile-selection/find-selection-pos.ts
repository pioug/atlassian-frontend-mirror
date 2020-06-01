import { Selection } from 'prosemirror-state';
import { SelectionData } from './types';
import { GapCursorSelection, Side } from '../gap-cursor';
import { ResolvedPos } from 'prosemirror-model';

export const findSelectionPos = (selection: Selection): ResolvedPos | null => {
  const data = selection.toJSON() as SelectionData;
  switch (data.type) {
    case 'gapcursor':
      const gapcursorSelection = selection as GapCursorSelection;
      const base =
        gapcursorSelection.side === Side.LEFT
          ? selection.$anchor.nodeAfter
          : selection.$anchor.nodeBefore;
      return base ? base.resolve(1) : null;
    case 'all':
    case 'node':
    case 'text':
    case 'cell':
      return selection.$anchor;
  }
};
