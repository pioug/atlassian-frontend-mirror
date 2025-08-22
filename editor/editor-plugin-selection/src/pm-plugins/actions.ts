import type { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

export enum SelectionActionTypes {
	SET_DECORATIONS = 'SET_DECORATIONS',
	SET_RELATIVE_SELECTION = 'SET_RELATIVE_SELECTION',
}

export interface SetDecorations {
	decorationSet: DecorationSet;
	selection: Selection;
	type: SelectionActionTypes.SET_DECORATIONS;
}

export interface SetRelativeSelection {
	selectionRelativeToNode?: RelativeSelectionPos;
	type: SelectionActionTypes.SET_RELATIVE_SELECTION;
}

export type SelectionAction = SetDecorations | SetRelativeSelection;
