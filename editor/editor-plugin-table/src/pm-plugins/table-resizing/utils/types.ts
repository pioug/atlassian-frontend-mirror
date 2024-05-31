import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import type { ColumnState } from './column-state';

export interface ResizeState {
	cols: ColumnState[];
	widths: number[];
	maxSize: number;
	overflow: boolean;
	tableWidth: number;
	isScaled?: boolean;
}
export interface ResizeStateWithAnalytics {
	resizeState: ResizeState;
	table: ContentNodeWithPos;
	changed: boolean;
	attributes: {
		position: number;
		count: number;
		totalRowCount: number;
		totalColumnCount: number;
		widthsBefore: number[];
		widthsAfter: number[];
	};
}
