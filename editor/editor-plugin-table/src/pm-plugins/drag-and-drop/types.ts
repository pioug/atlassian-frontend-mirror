import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { TableDirection } from '../../types';

import type { DropTargetType } from './consts';

export interface DragAndDropPluginState {
	decorationSet: DecorationSet;
	dragMenuDirection?: TableDirection;
	dragMenuIndex: number;
	dropTargetIndex: number;
	dropTargetType: DropTargetType;
	isDragging: boolean;
	isDragMenuOpen: boolean;
	isKeyboardModeActive: boolean;
}

export type TriggerType = 'mouse' | 'keyboard';
