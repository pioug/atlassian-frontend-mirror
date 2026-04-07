import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

const GHOST_TEXT_CLASS = 'autocomplete-ghost-text';

/**
 * Creates a DecorationSet containing a ghost text widget at the given position.
 * The ghost text is rendered as a styled <span> that appears after the cursor.
 */
export const createGhostTextDecorationSet = (
	state: EditorState,
	position: number,
	text: string,
): DecorationSet => {
	if (!text) {
		return DecorationSet.empty;
	}

	const decoration = Decoration.widget(
		position,
		() => {
			const container = document.createElement('span');
			container.className = GHOST_TEXT_CLASS;
			container.setAttribute('data-autocomplete-ghost', 'true');
			container.style.color = '#999';
			container.style.opacity = '0.6';
			container.style.pointerEvents = 'none';
			container.style.userSelect = 'none';
			container.style.fontStyle = 'italic';
			// U+200B (Zero Width Space) gives the browser a line-break opportunity
			// immediately before the ghost text. This ensures the typed text before
			// the span is never pushed to the next line by the ghost text's width —
			// only the ghost text itself will wrap if it doesn't fit.
			container.textContent = '\u200b' + text;
			return container;
		},
		{
			side: 1, // Render after content at this position
			key: 'autocomplete-ghost-text',
		},
	);

	return DecorationSet.create(state.doc, [decoration]);
};
