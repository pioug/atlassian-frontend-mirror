import { Decoration } from '@atlaskit/editor-prosemirror/view';

import type { RevealOptions } from '../../../showDiffPluginType';
import type { ColorScheme } from '../colorSchemes/types';
import { buildDiffDecorationSpec, scrollMarginTopValue } from '../decorationKeys';
import { createContentWrapper } from './wrapBlockNodeView';

/**
 * U+2936 ARROW POINTING DOWNWARDS THEN CURVING LEFTWARDS — the return-key glyph.
 *
 * Exported so tests assert against the glyph actually rendered rather than a copy of it.
 */
export const RETURN_GLYPH = '⤶';

/**
 * The DOM for a removed blank line: the return glyph, struck through in the deleted colours.
 *
 * An empty paragraph or heading is a line the author deliberately added, but it has no content for
 * the deleted-content widget to serialize, so a deletion of one used to render nothing at all — the
 * reviewer saw the surrounding text close up with no sign of what was removed. Standing the glyph
 * in for the absent content keeps the deletion visible without inventing content that was not there.
 *
 * `createContentWrapper` supplies the highlight and the strikethrough line, so the glyph is styled
 * exactly like any other run of deleted inline content, including the active and reveal states.
 *
 * Hidden from assistive technology: the glyph is a picture of a key, and read out it is announced as
 * its Unicode name rather than as a removed line.
 */
export const createDeletedLineBreakWidget = ({
	colorScheme,
	count = 1,
	isActive = false,
	reveal,
}: {
	colorScheme?: ColorScheme;
	/** One glyph per removed blank line, for a run of adjacent ones. */
	count?: number;
	isActive?: boolean;
	reveal?: RevealOptions;
}): HTMLElement => {
	const dom = document.createElement('span');
	// The testid deleted content is matched by, so the glyph is found wherever deleted content is.
	dom.setAttribute('data-testid', 'show-diff-deleted-decoration');
	dom.setAttribute('aria-hidden', 'true');
	dom.contentEditable = 'false';
	// Scroll navigation aligns on the widget itself, as it does for every other deleted widget.
	dom.style.setProperty('scroll-margin-top', scrollMarginTopValue);

	for (let index = 0; index < Math.max(count, 1); index++) {
		if (index > 0) {
			// Each removed line gets its own line in the widget, so a run of blank lines reads as the
			// number of lines it was. `br` rather than a block wrapper: the widget is inline, and the
			// deleted-content wrapper is styled as an inline run.
			dom.append(dom.ownerDocument.createElement('br'));
		}
		const wrapper = createContentWrapper(colorScheme, isActive, false, reveal);
		wrapper.append(dom.ownerDocument.createTextNode(RETURN_GLYPH));
		dom.append(wrapper);
	}

	return dom;
};

/**
 * The glyph as a widget decoration anchored at `pos`.
 *
 * Shared by the two shapes a blank-line removal arrives in. On a forward diff the block is gone from
 * the new document, so the change lands on the deleted side and the glyph is anchored where the
 * block used to be. On an inverted diff — what AI suggested edits renders — the block is still in
 * the displayed document and the change lands on the *inserted* side, so the glyph is anchored
 * inside the surviving block, on the blank line itself.
 */
export const createDeletedLineBreakDecoration = ({
	attributionKey,
	colorScheme,
	count,
	isActive = false,
	pos,
	reveal,
	side,
}: {
	attributionKey?: string;
	colorScheme?: ColorScheme;
	count?: number;
	isActive?: boolean;
	pos: number;
	reveal?: RevealOptions;
	side?: number;
}): Decoration =>
	Decoration.widget(pos, createDeletedLineBreakWidget({ colorScheme, count, isActive, reveal }), {
		...buildDiffDecorationSpec({
			attributionKey,
			colorScheme,
			decorationType: 'widget',
			diffId: crypto.randomUUID(),
			isActive,
			// The glyph always stands in for removed content, whichever side of the changeset the
			// change itself landed on.
			isInserted: false,
			...(side !== undefined && { side }),
		}),
		// Without an explicit mark set, prosemirror-view wraps the widget in the marks of the
		// adjacent text. The glyph carries its own deleted styling and must not inherit them.
		marks: [],
	});
