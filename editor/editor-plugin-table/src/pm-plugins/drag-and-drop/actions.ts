import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { TableDirection } from '../../types';

import type { DropTargetType } from './consts';

interface DragAndDropAction<T, D> {
	data: D;
	type: T;
}

export const DragAndDropActionType = {
	SET_DROP_TARGET: 'SET_DROP_TARGET',
	CLEAR_DROP_TARGET: 'CLEAR_DROP_TARGET',
	TOGGLE_DRAG_MENU: 'TOGGLE_DRAG_MENU',
} as const;

type DragAndDropSetDropTargetAction = DragAndDropAction<
	typeof DragAndDropActionType.SET_DROP_TARGET,
	{
		decorationSet: DecorationSet;
		index: number;
		type: DropTargetType;
	}
>;

type DragAndDropClearDropTargetAction = DragAndDropAction<
	typeof DragAndDropActionType.CLEAR_DROP_TARGET,
	{
		decorationSet: DecorationSet;
	}
>;

type DragAndDropToggleDragMenuAction = DragAndDropAction<
	typeof DragAndDropActionType.TOGGLE_DRAG_MENU,
	{
		direction: TableDirection;
		index: number;
		isDragMenuOpen: boolean;
		isKeyboardModeActive: boolean;
	}
>;

// NOTE: This should be a Union of all possible actions
export type DragAndDropPluginAction =
	| DragAndDropSetDropTargetAction
	| DragAndDropClearDropTargetAction
	| DragAndDropToggleDragMenuAction;
