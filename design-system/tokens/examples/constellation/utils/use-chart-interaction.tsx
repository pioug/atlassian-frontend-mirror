import { type SVGProps, useState } from 'react';

export const useChartInteraction = (): {
	activeIndex: number | null;
	getPointProps: (index: number, label: string) => SVGProps<SVGGElement>;
	getTooltipProps: (index: number) => {
		onMouseEnter: () => void;
		onMouseLeave: () => void;
	};
} => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

	return {
		activeIndex: hoveredIndex ?? focusedIndex,
		getTooltipProps: (index) => ({
			onMouseEnter: () => setHoveredIndex(index),
			onMouseLeave: () => setHoveredIndex(null),
		}),
		getPointProps: (index, label) => ({
			role: 'img',
			'aria-label': label,
			tabIndex: 0,
			onMouseEnter: () => setHoveredIndex(index),
			onMouseLeave: () => setHoveredIndex(null),
			onFocus: () => setFocusedIndex(index),
			onBlur: () => setFocusedIndex(null),
			onKeyDown: (event) => {
				if (event.key === 'Escape') {
					setHoveredIndex(null);
					setFocusedIndex(null);
				}
			},
		}),
	};
};
