import { createCommand } from './plugin-state';
import { RowStickyState } from './types';

export const updateStickyState = (rowState: RowStickyState) =>
  createCommand({ name: 'UPDATE', state: rowState }, (tr) =>
    tr.setMeta('addToHistory', false),
  );

export const removeStickyState = (pos: number) =>
  createCommand({ name: 'REMOVE', pos }, (tr) =>
    tr.setMeta('addToHistory', false),
  );
