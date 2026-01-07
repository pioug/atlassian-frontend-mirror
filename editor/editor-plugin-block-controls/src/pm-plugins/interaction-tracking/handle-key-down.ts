import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import { startEditing } from './commands';
import { getInteractionTrackingState } from './pm-plugin';

export const handleKeyDown = (view: EditorView, event: KeyboardEvent): boolean => {
	// Check if this is a keyboard shortcut (Ctrl/Cmd + key)
	const isShortcut = event.ctrlKey || event.metaKey || event.altKey;

	if (isShortcut) {
		return false;
	}

	// Only consider actual typing keys (not shortcuts)
	// We need to check if it's a single character key or a deletion key
	// and ensure it's not part of a shortcut
	const isTypingKey =
		// Single character keys (letters, numbers, symbols)
		event.key.length === 1 ||
		event.key === 'Backspace' ||
		event.key === 'Delete' ||
		event.key === ' ' ||
		event.key === 'Enter';

	if (!isTypingKey) {
		return false;
	}

	const state = getInteractionTrackingState(view.state);

	// if user hasnt started typing yet, start timer
	if (!state?.isEditing) {
		startEditing(view);
	}

	return false;
};
