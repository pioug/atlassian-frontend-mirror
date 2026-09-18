import type { Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';

/**
 * The textblock types whose empty form is a blank line the author put there deliberately, and so
 * worth marking when a change removes it.
 *
 * Deliberately not every textblock: an empty `codeBlock` is an empty code block, which renders as a
 * visible box of its own and needs no stand-in.
 */
const BLANK_LINE_NODE_NAMES = new Set(['paragraph', 'heading']);

/**
 * Structurally empty: no children at all, not merely no measurable content. The two coincide for a
 * real node, and testing both keeps a node whose children report no size from passing as blank.
 */
const isEmptyTextBlock = (node: PMNode): boolean =>
	BLANK_LINE_NODE_NAMES.has(node.type.name) &&
	node.content.childCount === 0 &&
	node.content.size === 0;

/**
 * How many empty textblocks a slice holds, or 0 unless that is *all* it holds.
 *
 * Counted rather than tested for one, because a run of adjacent blank lines is reported as a single
 * change covering all of them — the case that made a single-block test miss.
 */
export const countEmptyTextBlockOnlySlice = (slice: Slice | undefined): number => {
	const childCount = slice?.content.childCount ?? 0;
	if (!slice || childCount === 0) {
		return 0;
	}

	for (let index = 0; index < childCount; index++) {
		if (!isEmptyTextBlock(slice.content.child(index))) {
			return 0;
		}
	}
	return childCount;
};

/**
 * The content position of every empty textblock lying wholly within `[from, to]`.
 *
 * Used to place a marker on each blank line a change removes. Partially covered blocks are skipped:
 * the change only took part of one, so it still has text of its own, which the inline decoration
 * already marks.
 */
export const emptyTextBlockContentPositions = (doc: PMNode, from: number, to: number): number[] => {
	const positions: number[] = [];

	doc.nodesBetween(from, to, (node, pos) => {
		if (node.isTextblock) {
			if (isEmptyTextBlock(node) && pos >= from && pos + node.nodeSize <= to) {
				// +1 steps over the block's own open token, into its (empty) content.
				positions.push(pos + 1);
			}
			// A textblock holds inline content only, so there is nothing below it to visit.
			return false;
		}
		// Keep descending: blank lines nest inside cells, columns and panels.
		return true;
	});

	return positions;
};
