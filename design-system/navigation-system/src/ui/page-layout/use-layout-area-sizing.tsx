import { useCallback, useContext, useEffect, useRef } from 'react';

import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';
import { fg } from '@atlaskit/platform-feature-flags/fg';

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
	isManaged: boolean;
	prepareResize: (() => Promise<boolean>) | undefined;
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
		xlDefaultWidth,
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

	const register = useCallback(() => {
		registerArea?.(area, {
			requestedWidth,
			defaultWidth,
			compactDefaultWidth,
			xlDefaultWidth,
			minWidth,
			maxWidth,
			isOpen,
			onRequestClose: requestClose,
		});
	}, [
		area,
		compactDefaultWidth,
		xlDefaultWidth,
		defaultWidth,
		isOpen,
		maxWidth,
		minWidth,
		registerArea,
		requestClose,
		requestedWidth,
	]);
	const isChatLayoutEnabled = fg('platform-dst-chat-panel-layout');
	// Restore the allocated width before a reopened panel can paint its CSS default.
	useLayoutEffect(() => {
		if (isChatLayoutEnabled) {
			register();
		}
	}, [isChatLayoutEnabled, register]);
	useEffect(() => {
		if (!isChatLayoutEnabled) {
			register();
		}
	}, [isChatLayoutEnabled, register]);
	// Match registration timing so an old owner's cleanup runs before a replacement registers.
	useLayoutEffect(() => {
		if (isChatLayoutEnabled) {
			return () => unregisterArea?.(area);
		}
	}, [area, isChatLayoutEnabled, unregisterArea]);
	useEffect(() => {
		if (!isChatLayoutEnabled) {
			return () => unregisterArea?.(area);
		}
	}, [area, isChatLayoutEnabled, unregisterArea]);

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
	return {
		state,
		startResize,
		resize,
		completeResize,
		getResizeBounds,
		isManaged: context !== null,
		prepareResize: context?.prepareResize,
	};
}
