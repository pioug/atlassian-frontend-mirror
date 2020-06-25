import { createCommand, RowStickyState } from './plugin-state';

export const updateStickyState = (rowState: RowStickyState) =>
  createCommand({ name: 'UPDATE', state: rowState }, tr =>
    tr.setMeta('addToHistory', false),
  );

export const removeStickyState = (pos: number) =>
  createCommand({ name: 'REMOVE', pos }, tr =>
    tr.setMeta('addToHistory', false),
  );
