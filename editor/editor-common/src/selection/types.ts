import type { EditorState, Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { LongPressSelectionPluginOptions } from '../types';

export enum RelativeSelectionPos {
	Before = 'Before',
	Start = 'Start',
	Inside = 'Inside',
	End = 'End',
}

export interface SelectionPluginState {
	/** Selected node class decorations */
	decorationSet: DecorationSet;
	/** Selection the decorations were built for */
	selection: Selection;
	/**
	 * Relative position of selection to either its parent node or, if a NodeSelection, its own node
	 * Used to manage where the selection should go when using arrow keys
	 */
	selectionRelativeToNode?: RelativeSelectionPos;
}
export type SetSelectionRelativeToNode = (props: {
	selectionRelativeToNode?: RelativeSelectionPos;
	selection?: Selection | null;
}) => (state: EditorState) => Transaction;

export type EditorSelectionAPI = {
	setSelectionRelativeToNode: SetSelectionRelativeToNode;
	getSelectionPluginState: (state: EditorState) => SelectionPluginState;
};

export type SelectionPluginOptions = LongPressSelectionPluginOptions;

export type SelectionSharedState =
	| {
			selectionRelativeToNode?: RelativeSelectionPos | undefined;
			selection?: Selection | undefined;
	  }
	| undefined;
