import { SelectionAction, SelectionActionTypes } from './actions';
import { SelectionPluginState } from './types';

export function reducer(
  pluginState: SelectionPluginState,
  action: SelectionAction,
): SelectionPluginState {
  switch (action.type) {
    case SelectionActionTypes.SET_DECORATIONS:
      return {
        ...pluginState,
        decorationSet: action.decorationSet,
        selection: action.selection,
      };
    default:
      return pluginState;
  }
}
