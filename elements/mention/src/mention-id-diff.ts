/** Changes in mention occurrences between two document snapshots, in document order. */
export type MentionIdDiff = {
	addedIds: string[];
	removedIds: string[];
};

const countIds = (ids: readonly string[]): Map<string, number> => {
	const counts = new Map<string, number>();
	for (const id of ids) {
		counts.set(id, (counts.get(id) ?? 0) + 1);
	}
	return counts;
};

/**
 * Compare mention IDs from two document snapshots. Each occurrence counts: adding a
 * second mention of the same ID is an addition, while moving one is not.
 * Consumers decide what an added or removed occurrence means for selection.
 */
export const diffMentionIds = (
	previousIds: readonly string[],
	nextIds: readonly string[],
): MentionIdDiff => {
	const remainingPrevious = countIds(previousIds);
	const remainingNext = countIds(nextIds);

	const addedIds = nextIds.filter((id) => {
		const count = remainingPrevious.get(id) ?? 0;
		if (count === 0) {
			return true;
		}
		remainingPrevious.set(id, count - 1);
		return false;
	});
	const removedIds = previousIds.filter((id) => {
		const count = remainingNext.get(id) ?? 0;
		if (count === 0) {
			return true;
		}
		remainingNext.set(id, count - 1);
		return false;
	});

	return { addedIds, removedIds };
};
