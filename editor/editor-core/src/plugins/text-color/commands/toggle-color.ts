import { Command } from '../../../types';
import { toggleMark } from '../../../utils/commands';
import { ACTIONS, pluginKey } from '../pm-plugins/main';
import { getDisabledState } from '../utils/disabled';

export const toggleColor = (color: string): Command => (state, dispatch) => {
  const { textColor } = state.schema.marks;

  let tr = state.tr;

  const disabledState = getDisabledState(state);
  if (disabledState) {
    if (dispatch) {
      dispatch(tr.setMeta(pluginKey, { action: ACTIONS.DISABLE }));
    }
    return false;
  }

  if (dispatch) {
    state.tr.setMeta(pluginKey, { action: ACTIONS.SET_COLOR, color });
    state.tr.scrollIntoView();
    toggleMark(textColor, { color })(state, dispatch);
  }
  return true;
};
