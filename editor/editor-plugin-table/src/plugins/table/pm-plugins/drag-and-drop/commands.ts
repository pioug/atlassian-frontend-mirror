import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { DragAndDropActionType } from './actions';
import type { DropTargetType } from './consts';
import { createCommand } from './plugin-factory';

// TODO: This command is a placeholder example. Please replace this if required.
export const setDropTarget = (
  type: DropTargetType,
  index: number,
  tr?: Transaction,
) =>
  createCommand(
    {
      type: DragAndDropActionType.SET_DROP_TARGET,
      data: {
        type,
        index,
      },
    },
    (originalTr: Transaction) =>
      (tr || originalTr).setMeta('addToHistory', false),
  );

export const clearDropTarget = (tr?: Transaction) =>
  createCommand(
    {
      type: DragAndDropActionType.CLEAR_DROP_TARGET,
    },
    (originalTr: Transaction) =>
      (tr || originalTr).setMeta('addToHistory', false),
  );
