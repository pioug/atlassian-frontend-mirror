import type { Change } from 'prosemirror-changeset';

/**
 * The granularity level a `smart` change was promoted to. Stored on span `data` so the
 * decoration pipeline can render each level differently (e.g. node-level deletions shown
 * below the new content). `null` for non-promoted (inline) changes.
 */
export type SmartChangeLevel = 'sentence' | 'paragraph' | 'node';

/** Span `data` payload carried by promoted `smart` changes. */
export type SmartSpanData = { smartLevel: SmartChangeLevel } | null;

/**
 * Build the `deleted`/`inserted` span arrays a `Change` needs. A length of 0 yields an
 * empty array (no change on that side).
 */
export const createSpans = (length: number, data: SmartSpanData = null): Change['inserted'] =>
	length > 0 ? [{ length, data }] : [];

/**
 * Build a promoted `Change` spanning `[fromA,toA)` in the original doc and `[fromB,toB)`
 * in the new doc, with both sides marked changed (mirrors `groupChangesByBlock` so the
 * decoration pipeline renders both the inserted-block decoration and the deleted-node
 * widget).
 *
 * `level` tags the change's spans so downstream decoration logic can treat node-level
 * promotions specially (see `smartChangeLevel`).
 */
export const makePromotedChange = (
	fromA: number,
	toA: number,
	fromB: number,
	toB: number,
	level?: SmartChangeLevel,
): Change => {
	const data: SmartSpanData = level ? { smartLevel: level } : null;
	// `deleted` and `inserted` must be independent arrays: downstream code may mutate one
	// side (push/splice), which would silently corrupt the other if they shared a reference.
	return {
		fromA,
		toA,
		fromB,
		toB,
		deleted: createSpans(Math.max(0, toA - fromA), data),
		inserted: createSpans(Math.max(0, toB - fromB), data),
	};
};

/**
 * Read the `smartLevel` tag off a change's spans, if present. Returns `undefined` for
 * changes not produced by the `smart` classifier (e.g. inline/block/step diff types).
 */
export const smartChangeLevel = (
	change: Pick<Change, 'inserted' | 'deleted'>,
): SmartChangeLevel | undefined => {
	const spans = [...change.inserted, ...change.deleted];
	for (const span of spans) {
		const data = span.data as SmartSpanData;
		if (data && typeof data === 'object' && 'smartLevel' in data) {
			return data.smartLevel;
		}
	}
	return undefined;
};

/** True when a change has no original-side (deleted) content — a pure insertion. */
const isPureInsertion = (change: Change): boolean => change.toA <= change.fromA;

/**
 * Coalesce changes that overlap in new-doc (B) coordinates.
 *
 * Merging two changes takes the UNION of their A (original-doc) ranges. That is only safe when
 * their A ranges actually touch/overlap — OR when at least one is a pure insertion (empty A).
 * Otherwise, merging a deletion at A[110,152] with a later edit at A[162,168] would fabricate an
 * A span [110,168] covering the untouched gap, which then overlaps a *different* change's A range
 * (making the same original content appear deleted twice). So we require B-overlap AND
 * (A-overlap OR a pure insertion) before coalescing.
 */
export const mergeOverlappingByNewDocRange = (changes: Change[]): Change[] => {
	if (changes.length <= 1) {
		return changes;
	}
	const sorted = [...changes].sort((l, r) => l.fromB - r.fromB);
	const merged: Change[] = [];
	let current = { ...sorted[0] };
	for (let i = 1; i < sorted.length; i++) {
		const next = sorted[i];
		const bOverlaps = next.fromB <= current.toB;
		// A ranges may be unioned only if they touch, or if either side contributes no A content.
		const aMergeable =
			isPureInsertion(current) ||
			isPureInsertion(next) ||
			rangesOverlap(current.fromA, current.toA, next.fromA, next.toA) ||
			next.fromA <= current.toA; // adjacency (sorted by B, A usually monotonic)
		if (bOverlaps && aMergeable) {
			current = {
				fromA: Math.min(current.fromA, next.fromA),
				toA: Math.max(current.toA, next.toA),
				fromB: Math.min(current.fromB, next.fromB),
				toB: Math.max(current.toB, next.toB),
				deleted: [...current.deleted, ...next.deleted],
				inserted: [...current.inserted, ...next.inserted],
			};
		} else {
			merged.push(current);
			current = { ...next };
		}
	}
	merged.push(current);
	return merged;
};

/** True when two half-open ranges overlap. */
export const rangesOverlap = (aFrom: number, aTo: number, bFrom: number, bTo: number): boolean =>
	aFrom < bTo && bFrom < aTo;
