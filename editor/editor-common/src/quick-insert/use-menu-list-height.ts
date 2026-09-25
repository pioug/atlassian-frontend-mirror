import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import type { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';

/** Keep the list viewport in sync with measured rows, including short search results. */
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
	const updateHeight = useCallback(() => {
		if (frame.current !== undefined) {
			cancelAnimationFrame(frame.current);
		}
		// CellMeasurer updates its cache during commit. Read it after all rows have measured.
		frame.current = requestAnimationFrame(() => {
			frame.current = undefined;
			const total = Array.from({ length: rowCount }, (_, index) =>
				cache.rowHeight({ index }),
			).reduce((sum, height) => sum + height, 0);
			setHeight(total);
		});
	}, [cache, rowCount]);

	useLayoutEffect(() => {
		updateHeight();
		return () => {
			if (frame.current !== undefined) {
				cancelAnimationFrame(frame.current);
			}
		};
	}, [rowKeySignature, updateHeight]);

	return { height, updateHeight };
}
