import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import type { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';

/**
 * Fits the scrolling viewport to the total row height, so short menus do not leave
 * empty space below their items. Rows can change height after rendering. Height
 * updates wait for the next frame so all row measurements are included.
 */
export function useMenuListHeight(
	cache: CellMeasurerCache,
	rowCount: number,
	rowKeySignature: string,
): { height: number; updateHeight: () => void } {
	const [height, setHeight] = useState(() =>
		Array.from({ length: rowCount }, (_, index) => cache.rowHeight({ index })).reduce(
			(sum, value) => sum + value,
			0,
		),
	);
	const frame = useRef<number>();
	const cancelFrame = useCallback(() => {
		if (frame.current !== undefined) {
			cancelAnimationFrame(frame.current);
			frame.current = undefined;
		}
	}, []);
	const updateHeight = useCallback(() => {
		cancelFrame();
		// CellMeasurer updates its cache during commit. Read it after all rows have measured.
		frame.current = requestAnimationFrame(() => {
			frame.current = undefined;
			const total = Array.from({ length: rowCount }, (_, index) =>
				cache.rowHeight({ index }),
			).reduce((sum, value) => sum + value, 0);
			setHeight(total);
		});
	}, [cache, cancelFrame, rowCount]);

	useLayoutEffect(() => {
		updateHeight();
		return cancelFrame;
	}, [cancelFrame, rowKeySignature, updateHeight]);

	return { height, updateHeight };
}
