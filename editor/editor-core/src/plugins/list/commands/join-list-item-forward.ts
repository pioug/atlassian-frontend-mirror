import { isEmptySelectionAtEnd, walkNextNode } from '../../../utils/commands';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  DELETE_DIRECTION,
  addAnalytics,
} from '../../analytics';
import { Command } from '../../../types';
import { findParentNodeOfType } from 'prosemirror-utils';
import { calcJoinListScenario } from '../actions/join-list-items-forward';

export const joinListItemForward: Command = (state, dispatch) => {
  const {
    tr,
    selection: { $head },
  } = state;
  const walkNode = walkNextNode($head);

  if (!isEmptySelectionAtEnd(state)) {
    return false;
  }

  const scenarios = calcJoinListScenario(walkNode, $head);

  if (!scenarios) {
    return false;
  }
  const [scenario, action] = scenarios;

  const result = action({
    tr,
    $next: walkNode.$pos,
    $head: $head,
  });

  if (!result) {
    return false;
  }

  const { bulletList, orderedList } = state.schema.nodes;
  const listParent = findParentNodeOfType([bulletList, orderedList])(
    tr.selection,
  );

  let actionSubjectId = ACTION_SUBJECT_ID.FORMAT_LIST_BULLET;
  if (listParent && listParent.node.type === orderedList) {
    actionSubjectId = ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
  }

  addAnalytics(state, tr, {
    action: ACTION.LIST_ITEM_JOINED,
    actionSubject: ACTION_SUBJECT.LIST,
    actionSubjectId,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: INPUT_METHOD.KEYBOARD,
      direction: DELETE_DIRECTION.FORWARD,
      scenario,
    },
  });

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};
