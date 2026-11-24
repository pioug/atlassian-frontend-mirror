import { getOptions, isOptionDisabled } from './options';

export type RegistryElementBrowserArrowKey = 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp';
export const RETURN_TO_SEARCH = -1;
const virtualRowSelector = '[data-virtual-row]';

const getVirtualRowIndex = (element: Element | null): number | undefined => {
	const index = element?.closest<HTMLElement>(virtualRowSelector)?.dataset.virtualRow;
	return index === undefined ? undefined : Number(index);
};

/** A missing row is mounted on demand because registrations can disable their rendered options. */
export function* getVirtualizedArrowKeyTarget({
	container,
	currentOption,
	key,
	rowCount,
}: {
	container: HTMLElement;
	currentOption: HTMLElement | null;
	key: RegistryElementBrowserArrowKey;
	rowCount: number;
}): Generator<number, HTMLElement | typeof RETURN_TO_SEARCH | undefined, HTMLElement | null> {
	if (!currentOption && key !== 'ArrowDown') {
		return undefined;
	}

	const horizontal = key === 'ArrowLeft' || key === 'ArrowRight';
	const step = key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 1;
	const measured = new Map<HTMLElement, DOMRect>();
	const getRect = (option: HTMLElement) => {
		const rect = measured.get(option) ?? option.getBoundingClientRect();
		measured.set(option, rect);
		return rect;
	};
	const getCenter = (option: HTMLElement) => {
		const { left, width } = getRect(option);
		return left + width / 2;
	};
	const center = currentOption && !horizontal ? getCenter(currentOption) : undefined;
	// Only Recommended needs DOM row discovery because its tiles have different column spans.
	const recommendedRows: { options: HTMLElement[]; top: number }[] = [];
	for (const option of getOptions(container)) {
		if (getVirtualRowIndex(option) !== undefined) {
			continue;
		}
		const top = center === undefined ? 0 : getRect(option).top;
		const previousRow = recommendedRows[recommendedRows.length - 1];
		if (previousRow && Math.abs(top - previousRow.top) <= 1) {
			previousRow.options.push(option);
		} else {
			recommendedRows.push({ options: [option], top });
		}
	}

	const currentVirtualRow = getVirtualRowIndex(currentOption);
	const currentRow =
		currentVirtualRow === undefined
			? recommendedRows.findIndex(({ options }) =>
					options.some((option) => option === currentOption),
				)
			: recommendedRows.length + currentVirtualRow;
	const start = horizontal && currentRow >= 0 ? currentRow : currentRow + step;

	for (let row = start; row >= 0 && row < recommendedRows.length + rowCount; row += step) {
		const options =
			row < recommendedRows.length
				? recommendedRows[row].options
				: getOptions(yield row - recommendedRows.length);
		if (center !== undefined) {
			let nearest: HTMLElement | undefined;
			let distance = Infinity;
			for (const option of options) {
				if (!isOptionDisabled(option)) {
					const candidateDistance = Math.abs(getCenter(option) - center);
					if (candidateDistance < distance) {
						nearest = option;
						distance = candidateDistance;
					}
				}
			}
			if (nearest) {
				return nearest;
			}
			continue;
		}
		const currentIndex =
			row === currentRow ? options.findIndex((option) => option === currentOption) : -1;
		const first = step === 1 ? 0 : options.length - 1;
		for (
			let index = currentIndex === -1 ? first : currentIndex + step;
			index >= 0 && index < options.length;
			index += step
		) {
			if (!isOptionDisabled(options[index])) {
				return options[index];
			}
		}
	}

	return step === -1 ? RETURN_TO_SEARCH : undefined;
}
