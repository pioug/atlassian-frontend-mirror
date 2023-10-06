import { toggleMark } from '@atlaskit/editor-common/mark';
import { editorCommandToPMCommand } from '@atlaskit/editor-common/preset';
import type { Command } from '@atlaskit/editor-common/types';
import { ACTIONS, pluginKey } from '../pm-plugins/main';
import { getDisabledState } from '../utils/disabled';

export const toggleColor =
  (color: string): Command =>
  (state, dispatch) => {
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
      editorCommandToPMCommand(toggleMark(textColor, { color }))(
        state,
        dispatch,
      );
    }
    return true;
  };
