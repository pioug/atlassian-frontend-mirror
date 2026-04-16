import { panelSplitterDragDataSymbol } from './panel-splitter-drag-symbol';
import type { ResizeBounds } from './types';

export type PanelSplitterDragData = {
	panelId: string | symbol | undefined;
	initialWidth: number;
	resizingWidth: string;
	resizeBounds: ResizeBounds;
	direction: 'ltr' | 'rtl';
};

export function isPanelSplitterDragData(
	data: Record<string | symbol, unknown>,
): data is PanelSplitterDragData {
	return data[panelSplitterDragDataSymbol] === true;
}
