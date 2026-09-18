import type { Fragment, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration, type DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { DiffType } from '../showDiffPluginType';
import {
	DiffDecorationKey,
	isDiffDecoration,
	isDiffDecorationSpec,
} from './decorations/decorationKeys';
import { isExtendedEnabled } from './isExtendedEnabled';

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

function isRangeFullyInside(
	range1Start: number,
	range1End: number,
	range2Start: number,
	range2End: number,
): boolean {
	return range2Start <= range1Start && range1End <= range2End;
}

function specHasDiffKeyPrefix(spec: unknown, keyPrefix: string): spec is { key: string } {
	return Boolean(
		spec &&
		typeof spec === 'object' &&
		'key' in spec &&
		typeof spec.key === 'string' &&
		spec.key.startsWith(keyPrefix),
	);
}

/**
 * Where a decoration paints relative to others at the same position: negative before the node at
 * that position, positive after it. Only deleted-content widgets carry one — everything else is
 * ranged, and so paints where its range starts.
 */
function decorationSide(decoration: Decoration): number {
	return (isDiffDecoration(decoration) && decoration.spec.side) || 0;
}

/**
 * Whose change a decoration is part of, or `''` on an unattributed diff — where every decoration
 * reads as one contributor and the grouping below is unchanged.
 *
 * Contributors are kept apart so one stop never covers two of them, since only the tag on the
 * change stepped to reveals (EDITOR-8932).
 */
function contributorOf(decoration: Decoration): string {
	return (isDiffDecoration(decoration) && decoration.spec.attributionKey) || '';
}

/**
 * Collapses decorations that represent one continuous customer-facing edit.
 *
 * Decorations are kept separate in the DecorationSet so each one can retain its own visual
 * styling. This list is only used for change counting and navigation, where an insertion and a
 * deletion at the same location should be treated as one replacement. Zero-width decorations
 * (normally deleted-content widgets) can join a group, but cannot extend its range and therefore
 * cannot bridge two otherwise separate edits.
 *
 * One group per contributor within a run of touching ranges — see `contributorOf`.
 */
function groupTouchingDecorations(
	decorations: Decoration[],
	isInlineDecoration: (decoration: Decoration) => boolean,
): Decoration[] {
	if (decorations.length < 2) {
		return decorations;
	}

	type Group = { contributor: string; decorations: Decoration[]; from: number; to: number };
	const groups: Group[] = [];
	// The groups a following decoration can still join — one per contributor, dropped at every gap.
	let openGroups: Group[] = [];
	let clusterTo = 0;
	const sortedDecorations = [...decorations].sort((a, b) =>
		a.from === b.from ? a.to - b.to : a.from - b.from,
	);

	sortedDecorations.forEach((decoration) => {
		// A gap ends the run: nothing before it can be joined.
		if (decoration.from > clusterTo) {
			openGroups = [];
		}

		const contributor = contributorOf(decoration);
		// An unattributed decoration names nobody to keep apart, so it joins whatever is open — a
		// decision item's own highlight must not split the stop from the tag on its list.
		const openGroup =
			openGroups.find((group) => group.contributor === contributor) ??
			(contributor === '' ? openGroups[0] : openGroups.find((group) => group.contributor === ''));

		if (openGroup === undefined) {
			const group = {
				contributor,
				decorations: [decoration],
				from: decoration.from,
				to: decoration.to,
			};
			groups.push(group);
			openGroups = [...openGroups, group];
		} else {
			// The first contributor to join claims the group, so the next one still starts its own.
			openGroup.contributor = openGroup.contributor || contributor;
			openGroup.decorations.push(decoration);
			openGroup.to = Math.max(openGroup.to, decoration.to);
		}

		// A zero-width decoration must not extend the run and bridge a gap.
		clusterTo = Math.max(clusterTo, decoration.to);
	});

	return groups.map(({ decorations: group, from, to }) => {
		const representative =
			group.find(isInlineDecoration) ??
			group.find((decoration) => decoration.from !== decoration.to) ??
			group[0];

		if (!representative) {
			return representative;
		}

		// Deleted content is a widget at the start of the added content that replaced it, on a more
		// negative side so it paints above. That makes it the visual start of the edit, reachable
		// only through its own DOM — resolving the group's start position lands on the added content
		// painted after it. The group keeps its range, which navigation and the active-range
		// calculation both need, and reports the widget as what to scroll to.
		const scrollTarget = fg('platform_editor_ai_show_diff_patch_1')
			? group.find(
					(decoration) =>
						decoration.from === from && decorationSide(decoration) < decorationSide(representative),
				)
			: undefined;

		if (!scrollTarget && representative.from === from && representative.to === to) {
			return representative;
		}

		// This decoration is only used for navigation and active-range calculation. The actual
		// visual decorations remain in the DecorationSet with their original ranges and styles —
		// including their spec, hence a copy to add `scrollTarget` for `scrollToDiff` to read.
		const spec = { ...representative.spec, scrollTarget };
		return isInlineDecoration(representative)
			? Decoration.inline(from, to, {}, spec)
			: Decoration.node(from, to, {}, spec);
	});
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
 * 5. When `confluence_ncs_step_diffing_version_history` is enabled, groups overlapping or
 *    directly touching ranges across decoration types into one result per contributor, using the
 *    union of all grouped ranges
 *    (zero-width widgets can join a group without extending it). Under
 *    `platform_editor_ai_show_diff_patch_1`, a group that starts with content painting above
 * 	  the content that replaced it — reports that widget as its `scrollTarget` spec,
 *    so scrolling reaches the visual start of the edit
 * 6. Results are sorted by from position, then by to position
 *
 * @param set - The DecorationSet to extract scrollable decorations from
 * @param doc - Current document; when set, diff-inline ranges are validated against this doc
 * @returns Array of scrollable decorations, sorted and deduplicated
 */
export const getScrollableDecorations = (
	set: DecorationSet | undefined,
	doc?: PMNode,
	diffType?: DiffType,
): Decoration[] => {
	if (!set) {
		return [];
	}

	const isBlockDecoration = (decoration: Decoration): boolean =>
		isExtendedEnabled(diffType)
			? isDiffDecoration(decoration) && decoration.spec.decorationType === 'block'
			: (decoration.spec?.key?.startsWith(DiffDecorationKey.block) ?? false);
	const isInlineDecoration = (decoration: Decoration): boolean =>
		isExtendedEnabled(diffType)
			? isDiffDecoration(decoration) && decoration.spec.decorationType === 'inline'
			: (decoration.spec?.key?.startsWith(DiffDecorationKey.inline) ?? false);
	const isWidgetDecoration = (decoration: Decoration): boolean =>
		isExtendedEnabled(diffType)
			? isDiffDecoration(decoration) && decoration.spec.decorationType === 'widget'
			: (decoration.spec?.key?.startsWith(DiffDecorationKey.widget) ?? false);

	const seenBlockKeys = new Set<string>();
	const allDecorations = isExtendedEnabled(diffType)
		? set.find(undefined, undefined, isDiffDecorationSpec)
		: set.find(
				undefined,
				undefined,
				(spec) =>
					specHasDiffKeyPrefix(spec, DiffDecorationKey.inline) ||
					specHasDiffKeyPrefix(spec, DiffDecorationKey.widget) ||
					specHasDiffKeyPrefix(spec, DiffDecorationKey.block),
			);

	// First pass: filter out listItem blocks and deduplicates blocks
	const filtered = allDecorations.filter((dec) => {
		if (!isBlockDecoration(dec) && !isInlineDecoration(dec) && !isWidgetDecoration(dec)) {
			return false;
		}

		if (isBlockDecoration(dec)) {
			// Skip listItem blocks as they are not scrollable
			if (dec.spec?.nodeName === 'listItem') return false;

			const key = `${dec.from}-${dec.to}-${dec.spec.nodeName ?? ''}`;
			// Skip blocks that have already been seen
			if (seenBlockKeys.has(key)) return false;
			seenBlockKeys.add(key);
		}
		return true;
	});

	// Separate decorations by type for easier processing
	const blocks = filtered.filter(isBlockDecoration);
	const rawInlines = filtered.filter(isInlineDecoration);
	const inlines =
		doc !== undefined
			? rawInlines.filter((d) => isInlineDiffDecorationRenderableInDoc(doc, d.from, d.to))
			: rawInlines;
	const widgets = filtered.filter(isWidgetDecoration);

	let result: Decoration[];
	if (fg('confluence_ncs_step_diffing_version_history')) {
		// Group overlapping or directly touching ranges into one customer-facing edit.
		result = groupTouchingDecorations([...blocks, ...inlines, ...widgets], isInlineDecoration);
	} else {
		// Legacy behavior: exclude blocks that contain or are contained by an inline decoration.
		const nonOverlappingBlocks = blocks.filter(
			(block) =>
				!inlines.some(
					(inline) =>
						isRangeFullyInside(block.from, block.to, inline.from, inline.to) ||
						isRangeFullyInside(inline.from, inline.to, block.from, block.to),
				),
		);
		result = [...nonOverlappingBlocks, ...inlines, ...widgets];
	}

	// Sort by from position, then by to position
	result.sort((a, b) => (a.from === b.from ? a.to - b.to : a.from - b.from));

	return result;
};
