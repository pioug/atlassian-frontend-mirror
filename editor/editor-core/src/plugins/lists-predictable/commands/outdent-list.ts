import * as baseListCommand from 'prosemirror-schema-list';
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
import { mergeNextListAtPosition } from '../actions/merge-lists';
import { isInsideListItem } from '../utils/selection';
import { isBulletList } from '../utils/node';
import { getNextSiblingListItemPosition } from '../utils/indentation';
import { findFirstNestedList, findFirstParentListNode } from '../utils/find';
import { getCommonListAnalyticsAttributes } from '../utils/analytics';

type InputMethod = INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR;
export function outdentList(
  inputMethod: InputMethod = INPUT_METHOD.KEYBOARD,
): Command {
  return function (state, dispatch) {
    const { listItem } = state.schema.nodes;
    if (!isInsideListItem(state)) {
      return false;
    }
    const { $from } = state.selection;
    const nextSiblingListItemPosition = getNextSiblingListItemPosition($from);
    const firstNestedListResolvedPos = findFirstNestedList($from);
    const currentListNode = findFirstParentListNode($from);
    const actionSubjectId = isBulletList(currentListNode)
      ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
      : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

    let customTr: Transaction = state.tr;
    const fakeDispatch = (tr: Transaction) => {
      customTr = tr;
    };

    baseListCommand.liftListItem(listItem)(state, fakeDispatch);
    if (!customTr || !customTr.docChanged) {
      return false;
    }

    if (firstNestedListResolvedPos && nextSiblingListItemPosition) {
      mergeNextListAtPosition({
        listPosition: customTr.mapping.map(firstNestedListResolvedPos.pos),
        tr: customTr,
      });
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
