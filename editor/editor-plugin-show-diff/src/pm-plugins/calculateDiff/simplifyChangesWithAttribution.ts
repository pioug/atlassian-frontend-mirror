import { type Change, simplifyChanges } from 'prosemirror-changeset';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { getAttributionKey } from '../decorations/colorSchemes/attributions';

import { optimizeChanges } from './optimizeChanges';

type Range = { from: number; to: number };

type Span = Change['inserted'][number];

/**
 * A change, plus the block nodes it owns when it is one piece of a split — a piece's own range no
 * longer covers the container it opened. Absent on an unsplit change, which decorates the blocks
 * inside its own range as before.
 */
export type AttributedChange = Change & { blockNodeRangesB?: Range[] };

type AttributionIdentity = {
	key: string | undefined;
	mergeable: boolean;
};

const getAttributionIdentity = (change: Change): AttributionIdentity => {
	const identities = new Set<string | undefined>();

	for (const span of [...change.deleted, ...change.inserted]) {
		identities.add(getAttributionKey(span.data));
	}

	if (identities.size > 1) {
		return { key: undefined, mergeable: false };
	}

	return { key: identities.values().next().value, mergeable: true };
};

const byNewDocRange = (left: Change, right: Change): number =>
	left.fromB - right.fromB || left.toB - right.toB;

/** Union of the given ranges, with overlapping and touching ones merged. */
const mergeRanges = (ranges: Range[]): Range[] =>
	[...ranges]
		.sort((left, right) => left.from - right.from)
		.reduce<Range[]>((merged, range) => {
			const last = merged[merged.length - 1];
			if (last && range.from <= last.to) {
				last.to = Math.max(last.to, range.to);
				return merged;
			}
			return [...merged, { ...range }];
		}, []);

/** Whether `inner` sits wholly inside `outer` and covers less of the document. */
const isContained = (outer: Change, inner: Change): boolean =>
	inner.toB > inner.fromB &&
	outer.fromB <= inner.fromB &&
	inner.toB <= outer.toB &&
	inner.toB - inner.fromB < outer.toB - outer.fromB;

/**
 * The block nodes in `change` whose opening position `ownsPosition` claims. Ownership is by opening
 * position so a block another contributor added inside a container is not claimed by whoever opened
 * the container. `undefined` for a range this document cannot resolve, which falls the piece back
 * to decorating its own range.
 */
const blockNodeRanges = (
	doc: PMNode | undefined,
	change: Range,
	ownsPosition: (pos: number) => boolean,
): Range[] | undefined => {
	if (!doc || change.from >= change.to || change.to > doc.content.size) {
		return undefined;
	}

	const ranges: Range[] = [];
	doc.nodesBetween(change.from, change.to, (node, pos) => {
		if (node.isBlock && ownsPosition(pos) && pos + node.nodeSize <= change.to) {
			ranges.push({ from: pos, to: pos + node.nodeSize });
		}
		return true;
	});
	return ranges;
};

/**
 * Splits a change whose spans name more than one contributor into one change per run of consecutive
 * spans sharing a key.
 *
 * `prosemirror-changeset` merges contiguous inserted content into one change while keeping per-span
 * data, so a panel inserted by one contributor and edited inside by another arrives as a single
 * change holding every span — and the latest-writer rule credited all of it, panel included, to
 * whoever wrote last (EDITOR-8932).
 */
const splitMixedIdentityChanges = (
	changes: Change[],
	doc: PMNode | undefined,
): AttributedChange[] =>
	changes.flatMap((change): AttributedChange[] => {
		if (getAttributionIdentity(change).mergeable) {
			return [change];
		}

		const runs: Array<Range & { key: string | undefined; spans: Span[] }> = [];
		let offset = change.fromB;

		for (const span of change.inserted) {
			const key = getAttributionKey(span.data);
			const last = runs[runs.length - 1];

			if (last && last.key === key) {
				last.to = offset + span.length;
				last.spans.push(span);
			} else {
				runs.push({ key, from: offset, to: offset + span.length, spans: [span] });
			}
			offset += span.length;
		}

		// The offsets above are only positions if the spans partition the inserted range.
		if (runs.length < 2 || offset !== change.toB) {
			return [change];
		}

		return runs.map((run, index) => {
			const owned = blockNodeRanges(
				doc,
				{ from: change.fromB, to: change.toB },
				(pos) => pos >= run.from && pos < run.to,
			);

			return {
				...change,
				fromA: index === 0 ? change.fromA : change.toA,
				fromB: run.from,
				toB: run.to,
				deleted: index === 0 ? change.deleted : [],
				inserted: run.spans,
				...(owned ? { blockNodeRangesB: owned } : {}),
			};
		});
	});

/**
 * Subtracts every other author's contained change from a change's range, so both contributions
 * survive. Applies when the contributors arrive as separate changes rather than as spans of one —
 * the `step` diff type. A contained change by the same author, and one that only partially
 * overlaps, are left for the collapse below.
 *
 * The leading fragment keeps the deleted side, so one deletion is not drawn once per fragment.
 */
const splitContainedChanges = (changes: Change[], doc: PMNode | undefined): AttributedChange[] =>
	changes.flatMap((change): AttributedChange[] => {
		const { key } = getAttributionIdentity(change);
		const inner = mergeRanges(
			changes
				.filter((other) => {
					const otherKey = getAttributionIdentity(other).key;
					return (
						other !== change &&
						key !== undefined &&
						otherKey !== undefined &&
						otherKey !== key &&
						isContained(change, other)
					);
				})
				.map(({ fromB, toB }) => ({ from: fromB, to: toB })),
		);

		if (inner.length === 0) {
			return [change];
		}

		const gaps: Range[] = [];
		let cursor = change.fromB;
		for (const { from, to } of inner) {
			if (from > cursor) {
				gaps.push({ from: cursor, to: from });
			}
			cursor = Math.max(cursor, to);
		}
		if (change.toB > cursor) {
			gaps.push({ from: cursor, to: change.toB });
		}

		// Subtracted end to end, so nothing is left to highlight — but the blocks are still owned.
		const fragments = gaps.length > 0 ? gaps : [{ from: change.toB, to: change.toB }];
		// The outer author's: every block in their range that no inner change opened.
		const owned = blockNodeRanges(
			doc,
			{ from: change.fromB, to: change.toB },
			(pos) => !inner.some(({ from, to }) => pos >= from && pos < to),
		);

		return fragments.map((fragment, index) => ({
			...change,
			fromA: index === 0 ? change.fromA : change.toA,
			fromB: fragment.from,
			toB: fragment.to,
			deleted: index === 0 ? change.deleted : [],
			...(owned ? { blockNodeRangesB: index === 0 ? owned : [] } : {}),
		}));
	});

/**
 * The blocks a merged change owns. Both sides must name theirs, or the merge falls back to its own
 * range — narrowing it could drop a block altogether.
 */
const mergeBlockNodeRanges = (
	left: AttributedChange,
	right: AttributedChange,
): Range[] | undefined =>
	left.blockNodeRangesB && right.blockNodeRangesB
		? [...left.blockNodeRangesB, ...right.blockNodeRangesB]
		: undefined;

/** Unions the changes whose new-document ranges strictly overlap, leaving touching ones alone. */
const collapse = (changes: AttributedChange[]): AttributedChange[] => {
	// A zero-length new-document range paints no inline decoration, so it is kept aside rather than
	// folded into a neighbouring insertion.
	const emptyRanges = changes.filter((change) => change.toB <= change.fromB);
	const collapsed: AttributedChange[] = [];

	for (const change of changes.filter((change) => change.toB > change.fromB).sort(byNewDocRange)) {
		const current = collapsed[collapsed.length - 1];

		if (current && change.fromB < current.toB) {
			const blockNodeRangesB = mergeBlockNodeRanges(current, change);
			collapsed[collapsed.length - 1] = {
				fromA: Math.min(current.fromA, change.fromA),
				toA: Math.max(current.toA, change.toA),
				fromB: Math.min(current.fromB, change.fromB),
				toB: Math.max(current.toB, change.toB),
				deleted: [...current.deleted, ...change.deleted],
				inserted: [...current.inserted, ...change.inserted],
				...(blockNodeRangesB ? { blockNodeRangesB } : {}),
			};
		} else {
			collapsed.push({ ...change });
		}
	}

	return [...collapsed, ...emptyRanges].sort(byNewDocRange);
};

/**
 * Collapses changes whose new-document ranges strictly overlap. Attribution runs are simplified
 * independently, so runs either side of an unattributed step can come back covering the same
 * characters — which stacks two inline decorations and renders one contributor tag per copy.
 *
 * Merging keeps every span from both sides, so the latest-writer rule still decides whose tag is
 * shown. Ranges that merely touch are left alone, so an unattributed edit next to an attributed one
 * is not credited to it.
 *
 * Contributors are separated first, by `splitMixedIdentityChanges` and `splitContainedChanges`.
 * Both leave ranges that only touch, so they survive the collapse.
 *
 * Carries no gate of its own: the only caller reaches it through the attributed changeset, which
 * already requires `confluence_ncs_step_diffing_version_history`.
 */
export const collapseOverlappingChanges = (changes: Change[], doc?: PMNode): AttributedChange[] =>
	collapse(splitContainedChanges(splitMixedIdentityChanges(changes, doc), doc));

/**
 * Simplifies and optimizes consecutive changes without crossing an attribution boundary.
 * A change which already contains more than one identity is deliberately kept isolated.
 */
export const simplifyChangesWithAttribution = (
	changes: readonly Change[],
	doc: PMNode,
): Change[] => {
	const result: Change[] = [];
	let run: Change[] = [];
	let runIdentity: AttributionIdentity | undefined;

	const flush = () => {
		if (run.length > 0) {
			// Some show-diff producers use structurally compatible Change objects rather than the
			// library class. `simplifyChanges` reads runtime `lenA`/`lenB` getters even though they
			// are intentionally omitted from its public declarations, so add equivalent getters
			// without calling the library's internal constructor.
			const normalizedRun: Change[] = run.map((change) => ({
				...change,
				get lenA() {
					return change.toA - change.fromA;
				},
				get lenB() {
					return change.toB - change.fromB;
				},
			}));
			result.push(...optimizeChanges(simplifyChanges(normalizedRun, doc)));
		}
		run = [];
		runIdentity = undefined;
	};

	for (const change of changes) {
		const identity = getAttributionIdentity(change);
		const canJoinRun =
			runIdentity?.mergeable === true && identity.mergeable && runIdentity.key === identity.key;

		if (run.length > 0 && !canJoinRun) {
			flush();
		}

		run.push(change);
		runIdentity = identity;

		if (!identity.mergeable) {
			flush();
		}
	}

	flush();
	return result;
};
