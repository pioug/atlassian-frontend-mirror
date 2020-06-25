import { createCommand } from './plugin-factory';
import { SelectionActionTypes } from './actions';
import { getDecorations } from './utils';

export const setDecorations = () =>
  createCommand(state => ({
    type: SelectionActionTypes.SET_DECORATIONS,
    selection: state.tr.selection,
    decorationSet: getDecorations(state.tr),
  }));
