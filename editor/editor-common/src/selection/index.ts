import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Selection,
} from '@atlaskit/editor-prosemirror/state';
import {
  AllSelection,
  NodeSelection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables';
import { selectedRect } from '@atlaskit/editor-tables/utils';

import type { AnalyticsEventPayload } from '../analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../analytics';

export { RelativeSelectionPos } from './types';
export type { SelectionPluginState, EditorSelectionAPI } from './types';

export {
  GapCursorSelection,
  Side,
  JSON_ID,
  GapBookmark,
} from './gap-cursor/selection';

export { isIgnored, isValidTargetNode } from './gap-cursor/utils';
export { setGapCursorSelection } from './gap-cursor/utils/setGapCursorSelection';

export {
  atTheBeginningOfBlock,
  atTheBeginningOfDoc,
  atTheEndOfBlock,
  atTheEndOfDoc,
  endPositionOfParent,
  isSelectionAtEndOfNode,
  isSelectionAtStartOfNode,
  startPositionOfParent,
} from './utils';

export function getNodeSelectionAnalyticsPayload(
  selection: Selection,
): AnalyticsEventPayload | undefined {
  if (selection instanceof NodeSelection) {
    return {
      action: ACTION.SELECTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.NODE,
      eventType: EVENT_TYPE.TRACK,
      attributes: { node: selection.node.type.name },
    };
  }
}

export function getAllSelectionAnalyticsPayload(
  selection: Selection,
): AnalyticsEventPayload | undefined {
  if (selection instanceof AllSelection) {
    return {
      action: ACTION.SELECTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.ALL,
      eventType: EVENT_TYPE.TRACK,
    };
  }
}

export function getCellSelectionAnalyticsPayload(
  state: EditorState,
): AnalyticsEventPayload | undefined {
  if (state.selection instanceof CellSelection) {
    const rect = selectedRect(state);
    const selectedCells = rect.map.cellsInRect(rect).length;
    const totalCells = rect.map.map.length;
    return {
      action: ACTION.SELECTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.CELL,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        selectedCells,
        totalCells,
      },
    };
  }
}

export function getRangeSelectionAnalyticsPayload(
  selection: Selection,
  doc: PmNode,
): AnalyticsEventPayload | undefined {
  if (selection instanceof TextSelection && selection.from !== selection.to) {
    const { from, to, anchor, head } = selection;

    const nodes: string[] = [];
    doc.nodesBetween(from, to, (node, pos) => {
      // We want to send top-level nodes only, ie. the nodes that would have the selection styling
      // We allow text nodes that are not fully covered as they are a special case
      if (node.isText || (pos >= from && pos + node.nodeSize <= to)) {
        nodes.push(node.type.name);
        return false;
      }
    });

    return {
      action: ACTION.SELECTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.RANGE,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        from: anchor,
        to: head,
        nodes,
      },
    };
  }
}
