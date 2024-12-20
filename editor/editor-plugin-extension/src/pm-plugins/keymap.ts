import { bindKeymapWithCommand, escape } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import { clearEditingContext } from '../editor-commands/commands';

import { getPluginState } from './plugin-factory';

export default function keymapPlugin(applyChange: ApplyChangeHandler | undefined): SafePlugin {
	const list = {};

	bindKeymapWithCommand(
		escape.common!,
		(state, dispatch) => {
			const extensionState = getPluginState(state);

			if (!extensionState.showContextPanel) {
				return false;
			}

			return clearEditingContext(applyChange)(state, dispatch);
		},
		list,
	);

	return keymap(list) as SafePlugin;
}
