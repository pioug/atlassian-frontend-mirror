import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { closeDatePicker, openDatePicker, focusDateInput } from '../actions';
import {
  keymap,
  enter,
  tab,
  bindKeymapWithCommand,
} from '@atlaskit/editor-common/keymaps';
import { getPluginState } from './main';

export function keymapPlugin(): SafePlugin {
  const list = {};

  bindKeymapWithCommand(
    enter.common!,
    (state, dispatch) => {
      const datePlugin = getPluginState(state);
      const isDateNode =
        state.selection instanceof NodeSelection
          ? state.selection.node.type === state.schema.nodes.date
          : false;

      if (!isDateNode) {
        return false;
      }

      if (!datePlugin.showDatePickerAt) {
        openDatePicker()(state, dispatch);
        return true;
      }

      closeDatePicker()(state, dispatch);
      return true;
    },
    list,
  );
  bindKeymapWithCommand(
    tab.common!,
    (state, dispatch) => {
      const datePlugin = getPluginState(state);
      const isDateNode =
        state.selection instanceof NodeSelection
          ? state.selection.node.type === state.schema.nodes.date
          : false;

      if (!isDateNode) {
        return false;
      }

      if (datePlugin.showDatePickerAt) {
        focusDateInput()(state, dispatch);
        return true;
      }
      return false;
    },
    list,
  );

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
