/** Keeps selection attached to the same registration when live menu updates reorder rows. */
export const reconcileRegisteredMenuSelection = ({
	nextIdentities,
	previousIdentities,
	previousIndex,
	reset,
}: {
	nextIdentities: readonly string[];
	previousIdentities: readonly string[];
	previousIndex: number;
	reset: boolean;
}): number => {
	if (nextIdentities.length === 0) {
		return -1;
	}

	if (reset) {
		return 0;
	}

	const previousIdentity = previousIdentities[previousIndex];
	if (previousIdentity !== undefined) {
		const nextIndex = nextIdentities.indexOf(previousIdentity);
		if (nextIndex >= 0) {
			return nextIndex;
		}
	}

	return Math.min(Math.max(previousIndex, 0), nextIdentities.length - 1);
};
