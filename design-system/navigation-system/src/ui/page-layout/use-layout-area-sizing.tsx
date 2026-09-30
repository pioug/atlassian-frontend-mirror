import { useCallback, useContext, useEffect, useRef } from 'react';

import {
	LayoutAreaSizingContext,
	type LayoutArea,
	type LayoutAreaConfig,
	type LayoutAreaMode,
	type LayoutAreaState,
} from './layout-area-sizing-context';
import { layoutAreaStateContexts } from './layout-area-state-contexts';
import type { ResizeBounds } from './panel-splitter/types';

export function useLayoutAreaSizing({
	area,
	config,
}: {
	area: LayoutArea;
	config: LayoutAreaConfig;
}): {
	state: LayoutAreaState | undefined;
	getResizeBounds: () => ResizeBounds | undefined;
	startResize: (mode: LayoutAreaMode) => void;
	resize: (mode: LayoutAreaMode, width: number) => void;
	completeResize: (mode: LayoutAreaMode, width: number) => void;
} {
	const context = useContext(LayoutAreaSizingContext);
	const {
		requestedWidth,
		defaultWidth,
		compactDefaultWidth,
		minWidth,
		maxWidth,
		isOpen,
		onRequestClose,
	} = config;
	const registerArea = context?.registerArea;
	const unregisterArea = context?.unregisterArea;
	const startAreaResize = context?.startResize;
	const resizeArea = context?.resize;
	const completeAreaResize = context?.completeResize;
	const getAreaResizeBounds = context?.getResizeBounds;
	const state = useContext(layoutAreaStateContexts[area]);
	// Dismissal is not a sizing input. Register a stable delegate while keeping
	// the consumer's latest committed callback outside allocation state.
	const onRequestCloseRef = useRef(onRequestClose);
	useEffect(() => {
		onRequestCloseRef.current = onRequestClose;
	}, [onRequestClose]);
	const requestClose = useCallback(() => onRequestCloseRef.current?.(), []);

	useEffect(() => {
		registerArea?.(area, {
			requestedWidth,
			defaultWidth,
			compactDefaultWidth,
			minWidth,
			maxWidth,
			isOpen,
			onRequestClose: requestClose,
		});
	}, [
		area,
		compactDefaultWidth,
		defaultWidth,
		isOpen,
		maxWidth,
		minWidth,
		registerArea,
		requestClose,
		requestedWidth,
	]);
	useEffect(() => () => unregisterArea?.(area), [area, unregisterArea]);

	const startResize = useCallback(
		(mode: LayoutAreaMode) => startAreaResize?.(area, mode),
		[area, startAreaResize],
	);
	const resize = useCallback(
		(mode: LayoutAreaMode, width: number) => resizeArea?.(area, mode, width),
		[area, resizeArea],
	);
	const completeResize = useCallback(
		(mode: LayoutAreaMode, width: number) => completeAreaResize?.(area, mode, width),
		[area, completeAreaResize],
	);

	const getResizeBounds = useCallback(
		() => getAreaResizeBounds?.(area),
		[area, getAreaResizeBounds],
	);
	return { state, startResize, resize, completeResize, getResizeBounds };
}
