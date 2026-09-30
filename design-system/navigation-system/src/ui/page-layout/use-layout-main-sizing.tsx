import { useContext, useEffect } from 'react';

import { LayoutAreaSizingContext, type LayoutWidthBound } from './layout-area-sizing-context';

export function useLayoutMainSizing(minWidth: LayoutWidthBound): void {
	const context = useContext(LayoutAreaSizingContext);
	const setMainMinWidth = context?.setMainMinWidth;
	useEffect(() => setMainMinWidth?.(minWidth), [minWidth, setMainMinWidth]);
}
