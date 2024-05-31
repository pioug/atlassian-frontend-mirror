import type { Fragment, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

// copied CellAttributes from adf-schema to avoid dependency cycles
export interface CellAttributes {
	colspan?: number;
	rowspan?: number;
	colwidth?: number[];
	background?: string;
}

export interface SelectionBounds {
	$from: ResolvedPos;
	$to: ResolvedPos;
}

export interface SerializedCellSelection {
	type: 'cell';
	anchor: number;
	head: number;
}

export interface CellSelectionRect {
	height: number;
	width: number;
	rows: Fragment[];
}

export type Axis = 'horiz' | 'vert';

/*
 * UP = -1
 * DOWN = 1
 * LEFT = -1
 * RIGHT = 1
 */
export type Direction = -1 | 1;

export type Dispatch = (tr: Transaction) => void;
export type Command = (state: EditorState, dispatch?: Dispatch) => boolean;
export type CommandWithView = (
	state: EditorState,
	dispatch?: Dispatch,
	view?: EditorView,
) => boolean;

export type SelectionRange = {
	$anchor: ResolvedPos;
	$head: ResolvedPos;
	// an array of column/row indexes
	indexes: number[];
};

export type CellAttributesWithColSpan = CellAttributes & {
	colspan: number;
};

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export interface MoveOptions {
	tryToFit?: boolean;
	direction?: number;
	selectAfterMove?: boolean;
}

export interface CloneOptions {
	tryToFit?: boolean;
	direction?: number;
	selectAfterClone?: boolean;
}
