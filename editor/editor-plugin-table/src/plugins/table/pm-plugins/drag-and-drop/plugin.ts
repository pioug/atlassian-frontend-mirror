import type {
  Dispatch,
  EventDispatcher,
} from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';

import type { DraggableSourceData } from '../../types';
import {
  hasMergedCellsInColumn,
  hasMergedCellsInRow,
} from '../../utils/merged-cells';
import { getPluginState as getTablePluginState } from '../plugin-factory';

import { clearDropTarget, moveSource, setDropTarget } from './commands';
import { DropTargetType } from './consts';
import { createPluginState, getPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';
import { getDraggableDataFromEvent } from './utils/monitor';

export const createPlugin = (
  dispatch: Dispatch,
  eventDispatcher: EventDispatcher,
) => {
  return new SafePlugin({
    state: createPluginState(dispatch, (state) => ({
      decorationSet: DecorationSet.empty,
      // TODO: This is example placeholder state. We could use this to track which row/col is currently set as the drop target
      // This would result in a blue highlight being displayed on the corrisponding row/column to single the drop target location.
      dropTargetType: DropTargetType.NONE,
      dropTargetIndex: 0,
    })),
    key: pluginKey,
    view: (editorView: EditorView) => {
      return {
        destroy: monitorForElements({
          canMonitor({ source }) {
            const { type, localId, indexes } =
              source.data as Partial<DraggableSourceData>;

            // First; Perform any quick checks so we can abort early.
            if (
              !indexes ||
              !localId ||
              // FIXME: We currently don't support DragNDrop of multiple elements. For now we will not bother to monitor drags
              // of more then 1 item.
              indexes.length !== 1 ||
              !(type === 'table-row' || type === 'table-column')
            ) {
              return false;
            }

            const { tableNode } = getTablePluginState(editorView.state);
            // If the draggable localId is the same as the current selected table localId then we will allow the monitor
            // watch for changes
            return localId === tableNode?.attrs.localId;
          },
          onDrag(event) {
            const data = getDraggableDataFromEvent(event);
            // If no data can be found then it's most like we do not want to perform any drag actions
            if (!data) {
              clearDropTarget()(editorView.state, editorView.dispatch);
              return;
            }

            // TODO: as we drag an element around we are going to want to update the state to acurately reflect the current
            // insert location as to where the draggable will most likely be go. For example;
            const { sourceType, targetAdjustedIndex } = data;
            const dropTargetType =
              sourceType === 'table-row'
                ? DropTargetType.ROW
                : DropTargetType.COLUMN;

            setDropTarget(dropTargetType, targetAdjustedIndex)(
              editorView.state,
              editorView.dispatch,
            );
          },
          onDrop(event) {
            const data = getDraggableDataFromEvent(event);

            // If no data can be found then it's most like we do not want to perform any drop action
            if (!data) {
              clearDropTarget()(editorView.state, editorView.dispatch);
              return;
            }

            const { sourceType, sourceIndexes, targetAdjustedIndex } = data;

            // If the drop target index contains merged cells then we should not allow the drop to occur.
            const hasMergedCells =
              sourceType === 'table-row'
                ? hasMergedCellsInRow
                : hasMergedCellsInColumn;
            if (
              hasMergedCells(targetAdjustedIndex)(editorView.state.selection)
            ) {
              clearDropTarget()(editorView.state, editorView.dispatch);
              return;
            }

            const [sourceIndex] = sourceIndexes;
            moveSource(
              sourceType,
              sourceIndex,
              targetAdjustedIndex,
            )(editorView.state, editorView.dispatch);
          },
        }),
      };
    },
    props: {
      decorations: (state) => {
        const { decorationSet } = getPluginState(state);
        return decorationSet;
      },
    },
  });
};
