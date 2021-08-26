import { Command } from '../../../types/command';
import { pluginKey as typeAheadPluginKey } from '../pm-plugins/key';
import { ACTIONS } from '../pm-plugins/actions';

export const updateSelectedIndex = (selectedIndex: number): Command => {
  return (state, dispatch) => {
    const pluginState = typeAheadPluginKey.getState(state);

    if (pluginState.selectedIndex === selectedIndex) {
      return false;
    }

    const tr = state.tr;

    tr.setMeta(typeAheadPluginKey, {
      action: ACTIONS.UPDATE_SELECTED_INDEX,
      params: {
        selectedIndex,
      },
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};
