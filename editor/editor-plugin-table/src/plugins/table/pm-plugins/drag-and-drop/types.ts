import type { DropTargetType } from './consts';

export interface DragAndDropPluginState {
  dropTargetType: DropTargetType;
  dropTargetIndex: number;
}
