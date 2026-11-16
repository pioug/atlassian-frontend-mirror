import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { getDirtyTopLevelRanges } from './decorations';

/**
 * Counts rather than a set, because one id can appear on several nodes. Counts every annotation
 * mark, including on `mediaInline` and without the validation `getAllAnnotations` applies.
 */
export type AnnotationIdCounts = Map<string, number>;

type CountableTransaction = Pick<ReadonlyTransaction, 'mapping' | 'steps' | 'docs' | 'doc'>;

const countInRange = (doc: PMNode, from: number, to: number): AnnotationIdCounts => {
	const counts: AnnotationIdCounts = new Map();

	doc.nodesBetween(from, to, (node: PMNode) => {
		for (const mark of node.marks) {
			if (mark.type.name !== 'annotation') {
				continue;
			}
			const id = mark.attrs.id;
			counts.set(id, (counts.get(id) ?? 0) + 1);
		}
		return true;
	});

	return counts;
};

const combineCounts = (
	base: AnnotationIdCounts,
	added: AnnotationIdCounts[],
	removed: AnnotationIdCounts[],
): AnnotationIdCounts => {
	// Net change first, so the base map is copied once and only touched ids are revisited
	const delta = new Map<string, number>();
	const apply = (counts: AnnotationIdCounts, sign: 1 | -1) =>
		counts.forEach((count, id) => delta.set(id, (delta.get(id) ?? 0) + sign * count));

	added.forEach((counts) => apply(counts, 1));
	removed.forEach((counts) => apply(counts, -1));

	// Returning the same reference lets callers short-circuit on identity
	if (delta.size === 0) {
		return base;
	}

	const totals = new Map(base);
	delta.forEach((change, id) => {
		const total = (totals.get(id) ?? 0) + change;
		if (total > 0) {
			totals.set(id, total);
		} else {
			totals.delete(id);
		}
	});

	return totals;
};

export const createAnnotationIdCounts = (doc: PMNode): AnnotationIdCounts =>
	countInRange(doc, 0, doc.content.size);

export const updateAnnotationIdCounts = (
	previous: AnnotationIdCounts,
	tr: CountableTransaction,
): AnnotationIdCounts => {
	const oldDoc = tr.docs[0];
	if (!oldDoc) {
		return previous;
	}

	const ranges = getDirtyTopLevelRanges(tr, tr.doc);
	const isWholeDoc =
		ranges.length === 1 && ranges[0].from === 0 && ranges[0].to === tr.doc.content.size;

	if (isWholeDoc) {
		return createAnnotationIdCounts(tr.doc);
	}

	// Ranges are in the new document, so they are inverted to read the matching old content
	const inverted = tr.mapping.invert();

	return combineCounts(
		previous,
		ranges.map(({ from, to }) => countInRange(tr.doc, from, to)),
		ranges.map(({ from, to }) => countInRange(oldDoc, inverted.map(from, -1), inverted.map(to, 1))),
	);
};

export const getAnnotationIdsFromCounts = (counts: AnnotationIdCounts): Set<string> =>
	new Set(counts.keys());
