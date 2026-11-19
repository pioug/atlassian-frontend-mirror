import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { startEditing } from './commands';
import { clearPendingHoverSide } from './handle-mouse-move';
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

	// With the experiment, a queued mousemove clears the typing state when it finally runs. Typing
	// is newer than that move, so drop it, even if we are already editing.
	if (isExperimentEnabled('platform_editor_improve_inp_batch_3')) {
		clearPendingHoverSide(view);
	}

	const state = getInteractionTrackingState(view.state);

	// if user hasnt started typing yet, start timer
	if (!state?.isEditing) {
		startEditing(view);
	}

	return false;
};
