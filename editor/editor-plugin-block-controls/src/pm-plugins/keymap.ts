import { type IntlShape } from 'react-intl-next';

import {
	bindKeymapWithCommand,
	dragToMoveDown,
	dragToMoveLeft,
	dragToMoveRight,
	dragToMoveUp,
	showElementDragHandle,
} from '@atlaskit/editor-common/keymaps';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { moveNodeViaShortcut } from '../commands/move-node';
import { showDragHandleAtSelection } from '../commands/show-drag-handle';
import { DIRECTION } from '../consts';
import type { BlockControlsPlugin } from '../types';

function keymapList(
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
	formatMessage?: IntlShape['formatMessage'],
) {
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
		bindKeymapWithCommand(
			dragToMoveUp.common!,
			moveNodeViaShortcut(api, DIRECTION.UP, formatMessage),
			keymapList,
		);
		bindKeymapWithCommand(
			dragToMoveDown.common!,
			moveNodeViaShortcut(api, DIRECTION.DOWN, formatMessage),
			keymapList,
		);

		if (editorExperiment('nested-dnd', true) && fg('platform_editor_element_dnd_nested_a11y')) {
			bindKeymapWithCommand(
				dragToMoveLeft.common!,
				moveNodeViaShortcut(api, DIRECTION.LEFT, formatMessage),
				keymapList,
			);
			bindKeymapWithCommand(
				dragToMoveRight.common!,
				moveNodeViaShortcut(api, DIRECTION.RIGHT, formatMessage),
				keymapList,
			);
		}
	}
	return keymapList;
}

export const boundKeydownHandler = (
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
	formatMessage?: IntlShape['formatMessage'],
) => keydownHandler(keymapList(api, formatMessage));
