import type { Fragment, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

/**
 * True if `fragment` contains at least one inline node (text, hardBreak, emoji, mention, etc.).
 * Block-only subtrees (e.g. empty paragraphs, block cards with no inline children) return false.
 */
function fragmentContainsInlineContent(fragment: Fragment): boolean {
	for (let i = 0; i < fragment.childCount; i++) {
		const node = fragment.child(i);
		if (node.isInline) {
			return true;
		}
		if (node.content.size > 0 && fragmentContainsInlineContent(node.content)) {
			return true;
		}
	}
	return false;
}

/**
 * Returns true when an inline decoration's [from, to) range can actually show in the document:
 * positions are valid, and the slice contains at least one inline node ProseMirror would paint
 * (not only empty block wrappers or block-only structure).
 */
export function isInlineDiffDecorationRenderableInDoc(
	doc: PMNode,
	from: number,
	to: number,
): boolean {
	try {
		const slice = doc.slice(from, to);
		return fragmentContainsInlineContent(slice.content);
	} catch {
		return false;
	}
}

/**
 * Checks if range1 is fully contained within range2
 */
function isRangeFullyInside(
	range1Start: number,
	range1End: number,
	range2Start: number,
	range2End: number,
): boolean {
	return range2Start <= range1Start && range1End <= range2End;
}

/**
 * Gets scrollable decorations from a DecorationSet, filtering out overlapping decorations
 * and applying various rules for diff visualization.
 *
 * Rules:
 * 1. Only includes diff-inline, diff-widget-* and diff-block decorations
 * 2. Excludes listItem diff-block decorations (never scrollable)
 * 3. Deduplicates diff-block decorations with same from, to and nodeName
 * 4. When `doc` is passed: excludes diff-inline decorations whose range has no inline content
 *    (invalid positions, or block-only slices with no text/atoms — e.g. empty blocks)
 * 5. Excludes diff-inline decorations that are fully contained within a diff-block
 * 6. Excludes diff-block decorations that are fully contained within a diff-inline
 * 7. Results are sorted by from position, then by to position
 *
 * @param set - The DecorationSet to extract scrollable decorations from
 * @param doc - Current document; when set, diff-inline ranges are validated against this doc
 * @returns Array of scrollable decorations, sorted and deduplicated
 */
export const getScrollableDecorations = (
	set: DecorationSet | undefined,
	doc?: PMNode,
): Decoration[] => {
	if (!set) {
		return [];
	}

	const seenBlockKeys = new Set<string>();
	const allDecorations = set.find(
		undefined,
		undefined,
		(spec) =>
			spec.key === 'diff-inline' ||
			spec.key?.startsWith('diff-widget') ||
			spec.key === 'diff-block',
	);

	// First pass: filter out listItem blocks and deduplicates blocks
	const filtered = allDecorations.filter((dec) => {
		if (dec.spec?.key === 'diff-block') {
			// Skip listItem blocks as they are not scrollable
			if (dec.spec?.nodeName === 'listItem') return false;
		}
		const key = `${dec.from}-${dec.to}-${dec.spec?.nodeName ?? ''}`;
		// Skip blocks that have already been seen
		if (seenBlockKeys.has(key)) return false;
		seenBlockKeys.add(key);
		return true;
	});

	// Separate decorations by type for easier processing
	const blocks = filtered.filter((d) => d.spec?.key === 'diff-block');
	const rawInlines = filtered.filter((d) => d.spec?.key === 'diff-inline');
	const inlines =
		doc !== undefined
			? rawInlines.filter((d) => isInlineDiffDecorationRenderableInDoc(doc, d.from, d.to))
			: rawInlines;
	const widgets = filtered.filter((d) => d.spec?.key?.startsWith('diff-widget'));

	// Second pass: exclude overlapping decorations
	// Rules:
	// - If an inline is fully inside a block, exclude the block (inline takes priority)
	// - If a block is fully inside an inline, exclude the block (inline takes priority)
	const nonOverlappingBlocks = blocks.filter((block) => {
		// Exclude block if:
		// 1. It's fully contained within any inline, OR
		// 2. It fully contains any inline
		return !inlines.some(
			(inline) =>
				isRangeFullyInside(block.from, block.to, inline.from, inline.to) || // block inside inline
				isRangeFullyInside(inline.from, inline.to, block.from, block.to), // inline inside block
		);
	});

	// Combine all non-overlapping decorations
	const result = [...nonOverlappingBlocks, ...inlines, ...widgets];

	// Sort by from position, then by to position
	result.sort((a, b) => (a.from === b.from ? a.to - b.to : a.from - b.from));

	return result;
};
