import type { GridType } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export type Highlights = Array<'wide' | 'full-width' | number>;

export type GridPluginState = {
	gridType?: GridType;
	highlight: Highlights;
	visible: boolean;
};

type Required<T> = {
	[P in keyof T]-?: T[P];
};

type DisplayGrid = (props: Required<GridPluginState>) => boolean;
export type CreateDisplayGrid = (view: EditorView) => DisplayGrid;

export interface GridPluginOptions {
	shouldCalcBreakoutGridLines?: boolean;
}
