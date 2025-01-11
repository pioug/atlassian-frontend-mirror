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
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { moveNodeViaShortcut } from '../editor-commands/move-node';
import { showDragHandleAtSelection } from '../editor-commands/show-drag-handle';

import { DIRECTION } from './utils/consts';

function keymapList(
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
	formatMessage?: IntlShape['formatMessage'],
) {
	const keymapList = {};

	if (api && fg('platform_editor_element_drag_and_drop_ed_23873')) {
		bindKeymapWithCommand(
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			showElementDragHandle.common!,
			(state, dispatch, view) => {
				showDragHandleAtSelection(api)(state, dispatch, view);
				//we always want to handle this shortcut to prevent default browser special char insert when option + alphabetical key is used
				return true;
			},
			keymapList,
		);
		bindKeymapWithCommand(
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			dragToMoveUp.common!,
			moveNodeViaShortcut(api, DIRECTION.UP, formatMessage),
			keymapList,
		);
		bindKeymapWithCommand(
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			dragToMoveDown.common!,
			moveNodeViaShortcut(api, DIRECTION.DOWN, formatMessage),
			keymapList,
		);

		if (editorExperiment('nested-dnd', true) && fg('platform_editor_element_dnd_nested_a11y')) {
			bindKeymapWithCommand(
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				dragToMoveLeft.common!,
				moveNodeViaShortcut(api, DIRECTION.LEFT, formatMessage),
				keymapList,
			);
			bindKeymapWithCommand(
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				dragToMoveRight.common!,
				moveNodeViaShortcut(api, DIRECTION.RIGHT, formatMessage),
				keymapList,
			);
		}
	}
	return keymapList;
}

export const boundKeydownHandler: (
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
	formatMessage?: IntlShape['formatMessage'],
) => (view: EditorView, event: KeyboardEvent) => boolean = (
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
	formatMessage?: IntlShape['formatMessage'],
) => keydownHandler(keymapList(api, formatMessage));
