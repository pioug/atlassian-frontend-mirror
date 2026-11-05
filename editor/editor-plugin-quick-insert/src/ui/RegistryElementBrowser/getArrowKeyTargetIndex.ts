export type RegistryElementBrowserArrowKey = 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp';

export type RegistryElementBrowserOption = {
	/** Where the option sits on screen. Only Up and Down moves measure it. */
	getRect: () => { left: number; top: number; width: number };
	isDisabled: boolean;
};

type OptionPosition = { isDisabled: boolean; left: number; top: number; width: number };

export const RETURN_TO_SEARCH = -1;

// Options whose tops are within a pixel share a row, absorbing sub-pixel layout differences.
const ROW_TOLERANCE = 1;

const getCenter = ({ left, width }: OptionPosition) => left + width / 2;

const findNearestInRow = (
	options: OptionPosition[],
	rowTop: number,
	center: number,
): number | undefined => {
	let nearest: { distance: number; index: number } | undefined;
	options.forEach((option, index) => {
		if (option.isDisabled || Math.abs(option.top - rowTop) > ROW_TOLERANCE) {
			return;
		}
		const distance = Math.abs(getCenter(option) - center);
		if (!nearest || distance < nearest.distance) {
			nearest = { distance, index };
		}
	});
	return nearest?.index;
};

/**
 * Finds the option an arrow key moves to in the rendered result grids. Rows can have different
 * column counts, so vertical moves pick the nearest enabled option in the next row that has one.
 * Returns `RETURN_TO_SEARCH` when moving before the first option, or `undefined` to stay put.
 */
export const getArrowKeyTargetIndex = (
	options: RegistryElementBrowserOption[],
	currentIndex: number,
	key: RegistryElementBrowserArrowKey,
): number | undefined => {
	if (currentIndex < 0) {
		// Only ArrowDown enters the results from search; the other keys keep their native caret moves.
		if (key !== 'ArrowDown') {
			return undefined;
		}
		const firstEnabled = options.findIndex(({ isDisabled }) => !isDisabled);
		return firstEnabled < 0 ? undefined : firstEnabled;
	}

	if (key === 'ArrowLeft' || key === 'ArrowRight') {
		const step = key === 'ArrowRight' ? 1 : -1;
		for (let index = currentIndex + step; index >= 0 && index < options.length; index += step) {
			if (!options[index].isDisabled) {
				return index;
			}
		}
		return key === 'ArrowLeft' ? RETURN_TO_SEARCH : undefined;
	}

	// Rows can hold different numbers of tiles (2 wide tiles above 3 regular ones in Recommended), so
	// the row below or above, and the tile nearest the current one in it, come from screen positions.
	const positions = options.map(({ getRect, isDisabled }) => {
		const { left, top, width } = getRect();
		return { isDisabled, left, top, width };
	});
	const current = positions[currentIndex];
	const isDown = key === 'ArrowDown';
	// The rows past the current one in the direction of travel, each identified by its top edge,
	// nearest first so the first row with an enabled tile wins.
	const rowsAhead = [
		...new Set(
			positions
				.map(({ top }) => top)
				.filter((top) =>
					isDown ? top > current.top + ROW_TOLERANCE : top < current.top - ROW_TOLERANCE,
				),
		),
	].sort((first, second) => (isDown ? first - second : second - first));

	for (const rowTop of rowsAhead) {
		const target = findNearestInRow(positions, rowTop, getCenter(current));
		if (target !== undefined) {
			return target;
		}
	}
	return isDown ? undefined : RETURN_TO_SEARCH;
};
