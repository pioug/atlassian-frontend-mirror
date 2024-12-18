import type { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

export enum SelectionActionTypes {
	SET_DECORATIONS = 'SET_DECORATIONS',
	SET_RELATIVE_SELECTION = 'SET_RELATIVE_SELECTION',
}

export interface SetDecorations {
	type: SelectionActionTypes.SET_DECORATIONS;
	decorationSet: DecorationSet;
	selection: Selection;
}

export interface SetRelativeSelection {
	type: SelectionActionTypes.SET_RELATIVE_SELECTION;
	selectionRelativeToNode?: RelativeSelectionPos;
}

export type SelectionAction = SetDecorations | SetRelativeSelection;
