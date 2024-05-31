import { bindKeymapWithCommand, enter, tab } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Command } from '@atlaskit/editor-common/types';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

import { setFocusOnStatusInput } from '../actions';
import { mayGetStatusAtSelection } from '../utils';

import { pluginKey } from './plugin-key';

export function keymapPlugin(): SafePlugin {
	const list = {};
	bindKeymapWithCommand(enter.common!, consumeKeyEvent, list);
	bindKeymapWithCommand(
		tab.common!,
		(state, dispatch) => {
			const statusPluginState = pluginKey.getState(state);
			const isStatusNode =
				state.selection instanceof NodeSelection
					? state.selection.node.type === state.schema.nodes.status
					: false;

			if (!isStatusNode) {
				return false;
			}

			if (statusPluginState?.showStatusPickerAt) {
				setFocusOnStatusInput()(state, dispatch);
				return true;
			}
			return false;
		},
		list,
	);
	return keymap(list) as SafePlugin;
}

// consume event to prevent status node problems with positioning and selection
const consumeKeyEvent: Command = (state, _dispatch) =>
	!!mayGetStatusAtSelection(state.tr.selection);

export default keymapPlugin;
