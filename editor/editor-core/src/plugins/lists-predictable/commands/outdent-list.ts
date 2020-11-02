import { Command } from '../../../types';
import {
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../../analytics';
import { Transaction } from 'prosemirror-state';
import { isInsideListItem } from '../utils/selection';
import { isBulletList } from '../utils/node';
import { findFirstParentListNode } from '../utils/find';
import { getCommonListAnalyticsAttributes } from '../utils/analytics';
import { outdentListItemsSelected as outdentListAction } from '../actions/outdent-list-items-selected';

type InputMethod = INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR;
export function outdentList(
  inputMethod: InputMethod = INPUT_METHOD.KEYBOARD,
): Command {
  return function (state, dispatch) {
    if (!isInsideListItem(state)) {
      return false;
    }
    const { $from } = state.selection;
    const parentListNode = findFirstParentListNode($from);
    if (!parentListNode) {
      // Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
      return true;
    }

    const actionSubjectId = isBulletList(parentListNode.node)
      ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
      : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

    let customTr: Transaction = state.tr;
    outdentListAction(customTr);
    if (!customTr || !customTr.docChanged) {
      // Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
      return true;
    }

    addAnalytics(state, customTr, {
      action: ACTION.OUTDENTED,
      actionSubject: ACTION_SUBJECT.LIST,
      actionSubjectId,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        ...getCommonListAnalyticsAttributes(state),
        inputMethod,
      },
    });

    if (dispatch) {
      dispatch(customTr);
    }

    return true;
  };
}
