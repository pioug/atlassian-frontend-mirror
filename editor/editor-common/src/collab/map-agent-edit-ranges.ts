import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { slicesEqualIgnoringLocalId } from './agent-review-slice-compare';

type Range = { from: number; to: number };

/**
 * Tracks which parts of the agent's output survive later edits. For example, if the
 * agent wrote "AB" and someone inserts "X" between the letters, the result contains
 * separate ranges for "A" and "B". This keeps "X" out of the acceptance metric.
 * Rewriting only local IDs or rolling back and reapplying a step during a rebase
 * preserves the attribution of the surviving content.
 */
export function mapAgentEditRanges(
	ranges: readonly Range[],
	transaction: Pick<ReadonlyTransaction, 'doc' | 'docs' | 'mapping'>,
	options?: { from?: number; onRemoved?: (stepIndex: number, range: Range) => void },
): Range[] {
	if (ranges.length === 0) {
		return [];
	}
	const { mapping } = transaction;
	let current = [...ranges];
	const recoveredByMirror = new Map<number, Range[]>();

	for (let i = options?.from ?? 0; i < mapping.maps.length; i++) {
		const stepMap = mapping.maps[i];
		const next: Range[] = [];
		const unchangedReplacements = new Map<number, boolean>();
		const addRange = (from: number, to: number) => {
			const mappedFrom = stepMap.map(from, 1);
			const mappedTo = stepMap.map(to, -1);
			if (mappedFrom < mappedTo) {
				next.push({ from: mappedFrom, to: mappedTo });
			}
		};
		for (const range of current) {
			let from = range.from;
			stepMap.forEach((oldStart, oldEnd, newStart, newEnd) => {
				if (oldStart >= range.to || oldEnd <= from) {
					return;
				}
				if (from < oldStart) {
					addRange(from, oldStart);
				}
				const start = Math.max(from, oldStart);
				const end = Math.min(range.to, oldEnd);
				if (start < end) {
					if (oldEnd - oldStart === newEnd - newStart) {
						let unchanged = unchangedReplacements.get(oldStart);
						if (unchanged === undefined) {
							const before = transaction.docs[i].slice(oldStart, oldEnd);
							const after = (transaction.docs[i + 1] ?? transaction.doc).slice(newStart, newEnd);
							unchanged = before.eq(after) || slicesEqualIgnoringLocalId(before, after);
							unchangedReplacements.set(oldStart, unchanged);
						}
						if (unchanged) {
							// Metadata-only replacements preserve positions inside the rewritten content.
							next.push({
								from: newStart + start - oldStart,
								to: newStart + end - oldStart,
							});
							from = Math.max(from, oldEnd);
							return;
						}
					}
					const mirror = mapping.getMirror(i);
					if (mirror !== undefined && mirror > i) {
						// A rebase rolls back local steps and reapplies them. Resume tracking at
						// the mirror so subsequent insertions still split the recovered range.
						const throughMirror = mapping.slice(i, mirror + 1);
						const recovered = {
							from: throughMirror.map(start, 1),
							to: throughMirror.map(end, -1),
						};
						if (recovered.from < recovered.to) {
							const waiting = recoveredByMirror.get(mirror);
							if (waiting) {
								waiting.push(recovered);
							} else {
								recoveredByMirror.set(mirror, [recovered]);
							}
						}
					} else {
						options?.onRemoved?.(i, { from: start, to: end });
					}
				}
				from = Math.max(from, oldEnd);
			});
			if (from < range.to) {
				addRange(from, range.to);
			}
		}
		current = next.concat(recoveredByMirror.get(i) ?? []);
	}
	return current;
}
