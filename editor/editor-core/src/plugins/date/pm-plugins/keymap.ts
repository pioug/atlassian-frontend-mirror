import { keymap } from 'prosemirror-keymap';
import { Plugin, NodeSelection } from 'prosemirror-state';
import { closeDatePicker, openDatePicker, focusDateInput } from '../actions';
import * as keymaps from '../../../keymaps';
import { getPluginState } from './main';

export function keymapPlugin(): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.enter.common!,
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
  keymaps.bindKeymapWithCommand(
    keymaps.tab.common!,
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

  return keymap(list);
}

export default keymapPlugin;
