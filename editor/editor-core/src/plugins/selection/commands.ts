import { SelectionActionTypes } from './actions';
import { createCommand } from './plugin-factory';
import { getDecorations } from './utils';

export const setDecorations = () =>
  createCommand(state => ({
    type: SelectionActionTypes.SET_DECORATIONS,
    selection: state.tr.selection,
    decorationSet: getDecorations(state.tr),
  }));
