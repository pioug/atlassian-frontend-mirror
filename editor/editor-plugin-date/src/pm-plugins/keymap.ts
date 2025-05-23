import { bindKeymapWithCommand, enter, keymap, tab } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

import { closeDatePicker, focusDateInput, openDatePicker } from './actions';
import { getPluginState } from './main';

export function keymapPlugin(): SafePlugin {
	const list = {};

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
