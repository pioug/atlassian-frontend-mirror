export const isValidReorder = (
	originIndex: number,
	targetIndex: number,
	targets: number[],
	type: 'row' | 'column',
): boolean => {
	const direction = originIndex > targetIndex ? -1 : 1;
	const errorMessage = `Target position is invalid, you can't move the ${type} ${originIndex} to ${targetIndex}, the target can't be split. You could use tryToFit option.`;

	if (direction === 1) {
		if (targets.slice(0, targets.length - 1).indexOf(targetIndex) !== -1) {
			throw new Error(errorMessage);
		}
	} else {
		if (targets.slice(1).indexOf(targetIndex) !== -1) {
			throw new Error(errorMessage);
		}
	}

	return true;
};
