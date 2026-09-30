import { type Context, createContext } from 'react';

import type { ResizeBounds } from './panel-splitter/types';

export type LayoutArea = 'side-nav' | 'panel' | 'chat-panel';
export type LayoutAreaMode = 'inline' | 'overlay';
export type LayoutWidthBound = number | `${number}px` | `${number}vw`;

export type LayoutAreaConfig = {
	/**
	 * Controlled requested width. Allocation may constrain it without changing the request.
	 */
	requestedWidth?: number;
	defaultWidth: number;
	compactDefaultWidth?: number;
	minWidth: LayoutWidthBound;
	maxWidth?: LayoutWidthBound;
	isOpen: boolean;
	onRequestClose?: () => void;
};

export type StoredLayoutArea = LayoutAreaConfig & {
	preferredInlineWidth?: number;
	preferredOverlayWidth?: number;
	liveResize?: { mode: LayoutAreaMode; width: number };
	openedAt?: number;
};

/**
 * Effective sibling widths held fixed during and after a user resize, until the
 * layout dimensions or configuration change. This is not a resize history.
 */
export type ResizeSession = {
	area: LayoutArea;
	baselineWidths: Partial<Record<LayoutArea, number>>;
};

export type LayoutAreaState = {
	mode: LayoutAreaMode;
	width: number;
	minWidth: number;
};

export type LayoutAreaAllocation = LayoutAreaState & {
	resizeBounds: { min: number; max: number };
};

export type LayoutAreaSizingContextValue = {
	getResizeBounds: (area: LayoutArea) => ResizeBounds | undefined;
	registerArea: (area: LayoutArea, config: LayoutAreaConfig) => void;
	unregisterArea: (area: LayoutArea) => void;
	startResize: (area: LayoutArea, mode: LayoutAreaMode) => void;
	resize: (area: LayoutArea, mode: LayoutAreaMode, width: number) => void;
	completeResize: (area: LayoutArea, mode: LayoutAreaMode, width: number) => void;
	setMainMinWidth: (minWidth: LayoutWidthBound) => void;
};

export const LayoutAreaSizingContext: Context<LayoutAreaSizingContextValue | null> =
	createContext<LayoutAreaSizingContextValue | null>(null);
