import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import type { ColumnState } from './column-state';

export interface ResizeState {
	cols: ColumnState[];
	isScaled?: boolean;
	maxSize: number;
	overflow: boolean;
	tableWidth: number;
	widths: number[];
}
export interface ResizeStateWithAnalytics {
	attributes: {
		count: number;
		position: number;
		totalColumnCount: number;
		totalRowCount: number;
		widthsAfter: number[];
		widthsBefore: number[];
	};
	changed: boolean;
	resizeState: ResizeState;
	table: ContentNodeWithPos;
}
