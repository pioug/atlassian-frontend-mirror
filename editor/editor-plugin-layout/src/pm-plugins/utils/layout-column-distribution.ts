const roundLayoutColumnWidth = (width: number): number => Number(width.toFixed(2));

const sumWidths = (widths: number[]): number => widths.reduce((sum, width) => sum + width, 0);

const normaliseWidthsTotal = (widths: number[], totalWidth: number, minWidth: number): number[] => {
	const roundedWidths = widths.map(roundLayoutColumnWidth);
	const remainder = roundLayoutColumnWidth(totalWidth - sumWidths(roundedWidths));

	if (remainder === 0 || roundedWidths.length === 0) {
		return roundedWidths;
	}

	let adjustmentIndex = 0;
	roundedWidths.forEach((width, index) => {
		if (width > roundedWidths[adjustmentIndex]) {
			adjustmentIndex = index;
		}
	});

	const adjustedWidth = roundLayoutColumnWidth(roundedWidths[adjustmentIndex] + remainder);
	if (adjustedWidth < minWidth) {
		return roundedWidths;
	}

	return roundedWidths.map((width, index) => (index === adjustmentIndex ? adjustedWidth : width));
};

const isValidWidth = (width: number): boolean => Number.isFinite(width) && width > 0;

const redistributeWithMinimumWidth = ({
	minWidth,
	totalWidth,
	weights,
}: {
	minWidth: number;
	totalWidth: number;
	weights: number[];
}): number[] | undefined => {
	if (weights.length * minWidth > totalWidth) {
		return;
	}

	const widths = Array(weights.length).fill(0) as number[];
	const clampedIndexes = new Set<number>();
	let remainingWidth = totalWidth;
	let remainingWeight = sumWidths(weights);

	while (clampedIndexes.size < weights.length) {
		const remainingWidthForPass = remainingWidth;
		const remainingWeightForPass = remainingWeight;
		const indexesToClamp: number[] = [];

		weights.forEach((weight, index) => {
			if (clampedIndexes.has(index)) {
				return;
			}

			const proportionalWidth =
				remainingWeightForPass > 0 ? (weight / remainingWeightForPass) * remainingWidthForPass : 0;
			if (proportionalWidth < minWidth) {
				indexesToClamp.push(index);
			}
		});

		if (indexesToClamp.length === 0) {
			break;
		}

		indexesToClamp.forEach((index) => {
			widths[index] = minWidth;
			clampedIndexes.add(index);
			remainingWidth -= minWidth;
			remainingWeight -= weights[index];
		});
	}

	weights.forEach((weight, index) => {
		if (!clampedIndexes.has(index)) {
			widths[index] = remainingWeight > 0 ? (weight / remainingWeight) * remainingWidth : minWidth;
		}
	});

	return widths;
};

/**
 * Returns true when the given selected columns already reflect the distribution that
 * `distributeLayoutColumns` would produce — i.e. the first N-1 cols each hold
 * `equalWidth` (rounded to 2 dp) and the last col absorbs the rounding remainder.
 *
 * This mirrors the action's "last col absorbs remainder" logic so that the UI can
 * disable the option when it would be a no-op, avoiding spurious undo entries.
 */
export type Distribution = {
	equalWidth: number;
	selectedTotal: number;
};

export const calculateDistribution = (selectedWidths: number[]): Distribution | undefined => {
	const count = selectedWidths.length;
	if (count < 2) {
		return undefined;
	}

	const selectedTotal = sumWidths(selectedWidths);
	const equalWidth = roundLayoutColumnWidth(selectedTotal / count);

	return { selectedTotal, equalWidth };
};

export function isDistributedUniformly(
	selectedWidths: number[],
	distribution: Distribution | undefined = calculateDistribution(selectedWidths),
): boolean {
	if (!distribution || selectedWidths.length < 2) {
		return false;
	}

	const { selectedTotal, equalWidth } = distribution;
	const lastColWidth = roundLayoutColumnWidth(
		selectedTotal - equalWidth * (selectedWidths.length - 1),
	);
	return (
		selectedWidths.slice(0, -1).every((width) => width === equalWidth) &&
		selectedWidths[selectedWidths.length - 1] === lastColWidth
	);
}

export const redistributeAfterDeletion = (
	currentWidths: number[],
	removeIndex: number,
	minWidth: number,
): number[] => {
	if (
		currentWidths.length === 0 ||
		removeIndex < 0 ||
		removeIndex >= currentWidths.length ||
		!isValidWidth(minWidth)
	) {
		return currentWidths;
	}

	if (currentWidths.some((width) => !isValidWidth(width))) {
		return currentWidths.filter((_, i) => i !== removeIndex);
	}

	const remainingWidths = currentWidths.filter((_, i) => i !== removeIndex);
	if (remainingWidths.length === 0) {
		return remainingWidths;
	}

	const currentTotalWidth = sumWidths(currentWidths);
	const targetTotalWidth = Math.round(currentTotalWidth) === 100 ? 100 : currentTotalWidth;

	const redistributed = redistributeWithMinimumWidth({
		weights: remainingWidths,
		totalWidth: targetTotalWidth,
		minWidth,
	});

	if (!redistributed) {
		const equalWidth = roundLayoutColumnWidth(targetTotalWidth / remainingWidths.length);
		return normaliseWidthsTotal(
			Array(remainingWidths.length).fill(equalWidth) as number[],
			targetTotalWidth,
			minWidth,
		);
	}

	return normaliseWidthsTotal(redistributed, targetTotalWidth, minWidth);
};

export const redistributeProportionally = (
	currentWidths: number[],
	insertIndex: number,
	maxColumns: number,
	minWidth: number,
): number[] => {
	if (
		currentWidths.length === 0 ||
		!Number.isInteger(maxColumns) ||
		maxColumns <= 0 ||
		currentWidths.length >= maxColumns ||
		insertIndex < 0 ||
		insertIndex > currentWidths.length ||
		!isValidWidth(minWidth) ||
		currentWidths.some((width) => !isValidWidth(width))
	) {
		return currentWidths;
	}

	const currentTotalWidth = sumWidths(currentWidths);
	if (!isValidWidth(currentTotalWidth)) {
		return currentWidths;
	}

	const targetTotalWidth = Math.round(currentTotalWidth) === 100 ? 100 : currentTotalWidth;
	const newColumnWidth = Math.max(
		minWidth,
		roundLayoutColumnWidth(targetTotalWidth / (currentWidths.length + 1)),
	);
	const existingColumnsTotalWidth = targetTotalWidth - newColumnWidth;
	if (existingColumnsTotalWidth < currentWidths.length * minWidth) {
		return currentWidths;
	}

	const redistributedExistingWidths = redistributeWithMinimumWidth({
		weights: currentWidths,
		totalWidth: existingColumnsTotalWidth,
		minWidth,
	});
	if (!redistributedExistingWidths) {
		return currentWidths;
	}

	const nextWidths = [...redistributedExistingWidths];
	nextWidths.splice(insertIndex, 0, newColumnWidth);

	return normaliseWidthsTotal(nextWidths, targetTotalWidth, minWidth);
};
