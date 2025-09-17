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
import { DIRECTION } from '@atlaskit/editor-common/types';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { moveNodeViaShortcut } from '../editor-commands/move-node';
import { showDragHandleAtSelection } from '../editor-commands/show-drag-handle';

function keymapList(
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
	formatMessage?: IntlShape['formatMessage'],
) {
	const keymapList = {};

	if (api) {
		bindKeymapWithCommand(
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			showElementDragHandle.common!,
			(state) => {
				showDragHandleAtSelection(api)(state);
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
	return keymapList;
}

export const boundKeydownHandler: (
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
	formatMessage?: IntlShape['formatMessage'],
) => (view: EditorView, event: KeyboardEvent) => boolean = (
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
	formatMessage?: IntlShape['formatMessage'],
) => keydownHandler(keymapList(api, formatMessage));
