import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { DropTargetType } from './consts';

export interface DragAndDropPluginState {
  decorationSet: DecorationSet;
  dropTargetType: DropTargetType;
  dropTargetIndex: number;
}
