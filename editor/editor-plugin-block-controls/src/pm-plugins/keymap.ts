import { bindKeymapWithCommand, showElementDragHandle } from '@atlaskit/editor-common/keymaps';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import { fg } from '@atlaskit/platform-feature-flags';

import { showDragHandleAtSelection } from '../commands/show-drag-handle';
import type { BlockControlsPlugin } from '../types';

function keymapList(api?: ExtractInjectionAPI<BlockControlsPlugin>) {
	let keymapList = {};

	if (api && fg('platform_editor_element_drag_and_drop_ed_23873')) {
		bindKeymapWithCommand(
			showElementDragHandle.common!,
			(state, dispatch, view) => {
				showDragHandleAtSelection(api)(state, dispatch, view);
				//we always want to handle this shortcut to prevent default browser special char insert when option + alphabetical key is used
				return true;
			},
			keymapList,
		);
	}
	return keymapList;
}

export const boundKeydownHandler = (api?: ExtractInjectionAPI<BlockControlsPlugin>) =>
	keydownHandler(keymapList(api));
