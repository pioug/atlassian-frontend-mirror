import {
  ACTION,
  ACTION_SUBJECT,
  AnalyticsEventPayload,
  SELECTION_POSITION,
  SELECTION_TYPE,
} from '@atlaskit/editor-common/analytics';
import { NodeSelection, Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNode } from '@atlaskit/editor-prosemirror/utils';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

export function getSelectionType(selection: Selection): {
  type: SELECTION_TYPE;
  position?: SELECTION_POSITION;
} {
  let type: SELECTION_TYPE;
  let position: SELECTION_POSITION | undefined;

  if (selection?.constructor?.name === 'GapCursorSelection') {
    type = SELECTION_TYPE.GAP_CURSOR;
    position = (selection as any).side;
  } else if (selection instanceof CellSelection) {
    type = SELECTION_TYPE.CELL;
  } else if (selection instanceof NodeSelection) {
    type = SELECTION_TYPE.NODE;
  } else if (selection.from !== selection.to) {
    type = SELECTION_TYPE.RANGED;
  } else {
    type = SELECTION_TYPE.CURSOR;
    const { from, $from } = selection;
    if (from === $from.start()) {
      position = SELECTION_POSITION.START;
    } else if (from === $from.end()) {
      position = SELECTION_POSITION.END;
    } else {
      position = SELECTION_POSITION.MIDDLE;
    }
  }

  return {
    type,
    position,
  };
}

export function findInsertLocation(selection: Selection): string {
  const { schema, name } = selection.$from.doc.type;
  if (selection instanceof NodeSelection) {
    return selection.node.type.name;
  }

  if (selection instanceof CellSelection) {
    return schema.nodes.table.name;
  }

  // Text selection
  const parentNodeInfo = findParentNode(
    node => node.type !== schema.nodes.paragraph,
  )(selection);

  return parentNodeInfo ? parentNodeInfo.node.type.name : name;
}

export function getStateContext(
  selection: Selection,
  payload: AnalyticsEventPayload,
): AnalyticsEventPayload {
  if (!payload.attributes) {
    return payload;
  }
  const { type, position } = getSelectionType(selection);
  payload.attributes.selectionType = type;
  if (position) {
    payload.attributes.selectionPosition = position;
  }
  const insertLocation = findInsertLocation(selection);

  if (
    payload.action === ACTION.INSERTED &&
    payload.actionSubject === ACTION_SUBJECT.DOCUMENT &&
    payload.attributes
  ) {
    payload.attributes.insertLocation = insertLocation;
  } else {
    payload.attributes.nodeLocation = insertLocation;
  }

  return payload;
}
