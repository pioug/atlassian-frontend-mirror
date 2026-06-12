import { ELEMENT_LIST_PADDING, SCROLLBAR_WIDTH } from '../../constants';

import { getColumnCount } from './getColumnCount';

type DatumReturnType = {
	availableWidth: number;
	columnCount: number;
};

type Options = {
	gutterSize: number;
	scrollbarWidth: number;
};

export function generateVirtualizedContainerDatum(
	containerWidth: number,
	options: Options,
): DatumReturnType {
	const { scrollbarWidth } = options;
	const columnCount = getColumnCount(containerWidth);
	const availableWidth = containerWidth - (scrollbarWidth + ELEMENT_LIST_PADDING);
	return {
		availableWidth,
		columnCount,
	};
}

let CALCULATED_SCROLLBAR_WIDTH: number;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getScrollbarWidth(): number {
	if (!CALCULATED_SCROLLBAR_WIDTH) {
		const container = document.createElement('div');
		container.style.visibility = 'hidden';
		container.style.overflow = 'scroll';
		document.body.appendChild(container);

		const innerContainer = document.createElement('div');
		container.appendChild(innerContainer);

		const scrollbarWidth = container.offsetWidth - innerContainer.offsetWidth;

		container.parentNode?.removeChild(container);

		if (scrollbarWidth) {
			CALCULATED_SCROLLBAR_WIDTH = scrollbarWidth;
			return scrollbarWidth;
		}

		return SCROLLBAR_WIDTH;
	} else {
		return CALCULATED_SCROLLBAR_WIDTH;
	}
}
// eslint-disable-next-line @atlaskit/editor/no-re-export
