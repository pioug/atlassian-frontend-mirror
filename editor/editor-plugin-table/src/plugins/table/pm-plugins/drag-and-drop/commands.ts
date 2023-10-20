import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { Decoration } from '@atlaskit/editor-prosemirror/view';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { moveColumn, moveRow } from '@atlaskit/editor-tables/utils';

import type { DraggableType } from '../../types';
import { TableDecorations } from '../../types';
import {
  createColumnInsertLine,
  createRowInsertLine,
  updateDecorations,
} from '../../utils';

import { DragAndDropActionType } from './actions';
import { DropTargetType } from './consts';
import { createCommand, getPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';

// TODO: This command is a placeholder example. Please replace this if required.
export const getDecorations = (state: EditorState): DecorationSet => {
  return pluginKey.getState(state)?.decorationSet || DecorationSet.empty;
};

export const updatePluginStateDecorations = (
  state: EditorState,
  decorations: Decoration[],
  key: TableDecorations,
): DecorationSet =>
  updateDecorations(state.doc, getDecorations(state), decorations, key);

export const setDropTarget = (
  type: DropTargetType,
  index: number,
  tr?: Transaction,
) =>
  createCommand(
    (state) => {
      const { dropTargetType, dropTargetIndex } = getPluginState(state);
      if (dropTargetType === type && dropTargetIndex === index) {
        return false;
      }

      let decorationSet = DecorationSet.empty;
      if (type === 'column') {
        decorationSet = updatePluginStateDecorations(
          state,
          createColumnInsertLine(index, state.selection),
          TableDecorations.COLUMN_INSERT_LINE,
        );
      } else if (type === 'row') {
        decorationSet = updatePluginStateDecorations(
          state,
          createRowInsertLine(index, state.selection),
          TableDecorations.ROW_INSERT_LINE,
        );
      }

      return {
        type: DragAndDropActionType.SET_DROP_TARGET,
        data: {
          decorationSet,
          type,
          index,
        },
      };
    },
    (originalTr: Transaction) =>
      (tr || originalTr).setMeta('addToHistory', false),
  );

export const clearDropTarget = (tr?: Transaction) =>
  createCommand(
    (state) => {
      const { dropTargetType, dropTargetIndex } = getPluginState(state);
      if (dropTargetType === DropTargetType.NONE && dropTargetIndex === 0) {
        return false;
      }

      return {
        type: DragAndDropActionType.CLEAR_DROP_TARGET,
        data: {
          decorationSet: DecorationSet.empty,
        },
      };
    },
    (originalTr: Transaction) =>
      (tr || originalTr).setMeta('addToHistory', false),
  );

export const moveSource = (
  sourceType: DraggableType,
  sourceIndex: number,
  targetIndex: number,
) =>
  createCommand(
    (state) => {
      return {
        type: DragAndDropActionType.CLEAR_DROP_TARGET,
        data: {
          decorationSet: DecorationSet.empty,
        },
      };
    },
    (tr: Transaction) => {
      if (sourceIndex === targetIndex) {
        return tr.setMeta('addToHistory', false);
      }

      const move = sourceType === 'table-row' ? moveRow : moveColumn;
      return move(
        sourceIndex,
        targetIndex + (sourceIndex > targetIndex ? 0 : -1),
      )(tr);
    },
  );
