/**
 * Determines whether keyboard events should be suppressed when the block menu is open.
 *
 * When the block menu is open, we want to block most keyboard events to prevent
 * unintended interactions. However, certain actions should still be allowed:
 * - Backspace/Delete: Allow deleting selected content
 * - Copy/Cut/Paste: Allow clipboard operations (Cmd/Ctrl+C, Cmd/Ctrl+X, Cmd/Ctrl+V)
 * - Undo/Redo: Allow undo/redo operations (Cmd/Ctrl+Z, Cmd/Ctrl+Y)
 * - Copy Link to Selection: Allow the keyboard shortcut (Cmd/Ctrl+Alt+A)
 *
 * @param event - The keyboard event to check
 * @returns true if the event should be suppressed, false if it should be allowed
 */
export const shouldSuppressKeyboardEvent = (event: KeyboardEvent): boolean => {
	const key = event.key.toLowerCase();
	const code = event.code.toLowerCase();
	const isMetaCtrl = event.metaKey || event.ctrlKey;
	const isAlt = event.altKey;

	// Check for allowed keyboard shortcuts
	const isBackspaceDelete = ['backspace', 'delete'].includes(key);
	const isCopyCutPaste = isMetaCtrl && ['c', 'x', 'v'].includes(key);
	const isUndoRedo = isMetaCtrl && ['z', 'y'].includes(key);

	// Use event.code to detect physical key 'A' because on macOS Option+A produces 'å'
	const isCopyLinkToBlock = isMetaCtrl && isAlt && code === 'keya';

	// Suppress all events except the allowed ones
	const suppressNativeHandling =
		!isCopyCutPaste && !isBackspaceDelete && !isUndoRedo && !isCopyLinkToBlock;

	return suppressNativeHandling;
};
