/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import type { Fragment, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

// copied CellAttributes from adf-schema to avoid dependency cycles
export interface CellAttributes {
	background?: string;
	colspan?: number;
	colwidth?: number[];
	rowspan?: number;
}

export interface SelectionBounds {
	$from: ResolvedPos;
	$to: ResolvedPos;
}

export interface SerializedCellSelection {
	anchor: number;
	head: number;
	type: 'cell';
}

export interface CellSelectionRect {
	height: number;
	rows: Fragment[];
	width: number;
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
	direction?: number;
	selectAfterMove?: boolean;
	tryToFit?: boolean;
}

export interface CloneOptions {
	direction?: number;
	selectAfterClone?: boolean;
	tryToFit?: boolean;
}
