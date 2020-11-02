import { Command } from '../../../types';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  addAnalytics,
} from '../../analytics';
import { hasValidListIndentationLevel } from '../utils/indentation';
import { indentListItemsSelected as indentListAction } from '../actions/indent-list-items-selected';
import { isBulletList } from '../utils/node';
import { findFirstParentListNode } from '../utils/find';
import { MAX_NESTED_LIST_INDENTATION } from '../types';
import { isInsideListItem } from '../utils/selection';
import { getListItemAttributes } from '../utils/selection';
import { getCommonListAnalyticsAttributes } from '../utils/analytics';

type InputMethod = INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR;
export function indentList(
  inputMethod: InputMethod = INPUT_METHOD.KEYBOARD,
): Command {
  return function (state, dispatch) {
    const {
      tr,
      selection: { $from },
    } = state;

    // don't indent if selection is not inside a list
    if (!isInsideListItem(state)) {
      return false;
    }
    const firstListItemSelectedAttributes = getListItemAttributes($from);

    if (
      firstListItemSelectedAttributes &&
      firstListItemSelectedAttributes.indentLevel === 0 &&
      firstListItemSelectedAttributes.itemIndex === 0
    ) {
      // Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
      return true;
    }

    const parentListNode = findFirstParentListNode($from);
    if (!parentListNode) {
      // Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
      return true;
    }

    const currentListNode = parentListNode.node;
    const actionSubjectId = isBulletList(currentListNode)
      ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
      : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
    indentListAction(tr);

    const maximimunNestedLevelReached = !hasValidListIndentationLevel({
      tr,
      maxIndentation: MAX_NESTED_LIST_INDENTATION,
    });

    if (maximimunNestedLevelReached || !tr.docChanged) {
      // Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
      return true;
    }

    addAnalytics(state, tr, {
      action: ACTION.INDENTED,
      actionSubject: ACTION_SUBJECT.LIST,
      actionSubjectId,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        ...getCommonListAnalyticsAttributes(state),
        inputMethod,
      },
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}
