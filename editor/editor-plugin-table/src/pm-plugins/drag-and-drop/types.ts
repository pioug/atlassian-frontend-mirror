import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { TableDirection } from '../../types';

import type { DropTargetType } from './consts';

export interface DragAndDropPluginState {
  decorationSet: DecorationSet;
  dropTargetType: DropTargetType;
  dropTargetIndex: number;
  isDragMenuOpen: boolean;
  dragMenuDirection?: TableDirection;
  dragMenuIndex: number;
  isDragging: boolean;
  isKeyboardModeActive: boolean;
}

export type TriggerType = 'mouse' | 'keyboard';
