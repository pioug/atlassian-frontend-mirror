import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

const GHOST_TEXT_CLASS = 'autocomplete-ghost-text';

/**
 * Creates a DecorationSet containing a ghost text widget at the given position.
 * The ghost text is rendered as a styled <span> that appears after the cursor.
 *
 * Takes the document rather than the whole state so it can also be called from
 * `apply`, where only the post-transaction doc exists.
 */
export const createGhostTextDecorationSet = (
	doc: PMNode,
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
			container.setAttribute('contenteditable', 'false');
			container.setAttribute('aria-hidden', 'true');
			container.style.color = '#999';
			container.style.opacity = '0.6';
			container.style.pointerEvents = 'auto';
			container.style.userSelect = 'none';
			container.style.cursor = 'pointer';
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
			// A matching key short-circuits `WidgetType.eq`, so ProseMirror reuses
			// the rendered node and never calls `toDOM` again. Keying on the text
			// keeps that reuse when nothing changed while still forcing a redraw
			// when the ghost advances through a keystroke that confirmed it —
			// otherwise the stale tail stays on screen and Tab inserts a
			// character the user already typed.
			key: `autocomplete-ghost-text:${text}`,
		},
	);

	return DecorationSet.create(doc, [decoration]);
};
