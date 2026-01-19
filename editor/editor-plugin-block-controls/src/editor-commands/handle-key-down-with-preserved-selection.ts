import { deleteSelectedRange } from '@atlaskit/editor-common/selection';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { stopPreservingSelection } from '../pm-plugins/selection-preservation/editor-commands';

const getKeyboardEventInfo = (event: KeyboardEvent) => {
	const key = event.key.toLowerCase();

	const isMetaCtrl = event.metaKey || event.ctrlKey;

	const isDelete = ['backspace', 'delete'].includes(key);
	const isCut = isMetaCtrl && key === 'x';
	const isPaste = isMetaCtrl && key === 'v';
	const isUndo = isMetaCtrl && key === 'z' && !event.shiftKey;
	const isRedo = isMetaCtrl && (key === 'y' || (key === 'z' && event.shiftKey));

	const isDestructive = isDelete || isCut || isPaste || isUndo || isRedo;

	const isModifierOnly = ['control', 'meta', 'alt', 'shift'].includes(key) && !isMetaCtrl;
	const isCopy = isMetaCtrl && key === 'c';
	const isInert = isModifierOnly || isCopy;

	return {
		isDelete,
		isDestructive,
		isInert,
	};
};

/**
 * Handles key presses when a selection is being preserved, when the block menu is open or closed.
 *
 * Based on the key pressed and whether the block menu is open or closed:
 * 1. Handles key presses with custom logic (e.g. delete/backspace)
 * 2. Closes the block menu
 * 3. Stops preserving the selection
 *
 * This is used in two places:
 * 1. selection preservation plugin when selection is being preserved, and focus is in the editor.
 * 2. block menu UI component when focus is in the block menu.
 *
 * Ensures consistent behaviour for key presses in both scenarios.
 */
export const handleKeyDownWithPreservedSelection =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>) =>
	(event: KeyboardEvent): EditorCommand =>
	({ tr }) => {
		if (!api) {
			return tr;
		}

		const { isDelete, isDestructive, isInert } = getKeyboardEventInfo(event);

		// Handle delete/backspace key presses with custom logic to ensure preserved selection is used
		if (isDelete) {
			tr = deleteSelectedRange(
				tr,
				api.blockControls?.sharedState.currentState()?.preservedSelection,
			);
		}

		const isBlockMenuOpen =
			api.userIntent?.sharedState.currentState()?.currentUserIntent === 'blockMenuOpen';

		// When selected content is being removed/modified/undo/redo and the block menu is open
		// close the block menu and refocus the editor
		const shouldCloseBlockMenu = isDestructive && isBlockMenuOpen;
		if (shouldCloseBlockMenu) {
			api.blockControls?.commands.toggleBlockMenu({ closeMenu: true })({ tr });
			api.core.actions.focus({ scrollIntoView: false });
		}

		// Stop preserving when:
		// 1. Content is being removed (delete/cut/paste) OR
		// 2. Menu is closed AND user pressed a non-inert key (i.e. action which modifies selection or content)
		// 3. undo/redo actions
		const shouldStopPreservingSelection = isDestructive || (!isBlockMenuOpen && !isInert);
		if (shouldStopPreservingSelection) {
			stopPreservingSelection({ tr });
		}

		return tr;
	};
