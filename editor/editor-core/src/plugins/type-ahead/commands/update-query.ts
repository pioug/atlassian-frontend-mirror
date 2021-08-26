import { Command } from '../../../types/command';
import { pluginKey as typeAheadPluginKey } from '../pm-plugins/key';
import { ACTIONS } from '../pm-plugins/actions';

export const updateQuery = (query: string): Command => {
  return (state, dispatch) => {
    const pluginState = typeAheadPluginKey.getState(state);

    if (pluginState.query === query) {
      return false;
    }

    const tr = state.tr;

    tr.setMeta(typeAheadPluginKey, {
      action: ACTIONS.CHANGE_QUERY,
      params: {
        query,
      },
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};
