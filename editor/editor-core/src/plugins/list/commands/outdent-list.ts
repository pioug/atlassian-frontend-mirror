import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type {
  RestartListsAttributesForListOutdented as RestartListAttributes,
  EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import { getCommonListAnalyticsAttributes } from '@atlaskit/editor-common/lists';
import type { Command } from '../../../types';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  OUTDENT_SCENARIOS,
} from '@atlaskit/editor-common/analytics';
import { isInsideListItem, isInsideTableCell } from '../utils/selection';
import { isBulletList } from '@atlaskit/editor-common/utils';
import { findFirstParentListNode } from '../utils/find';
import { getRestartListsAttributes } from '../utils/analytics';
import { outdentListItemsSelected as outdentListAction } from '../actions/outdent-list-items-selected';
import { closeHistory } from '@atlaskit/editor-prosemirror/history';
import type { FeatureFlags } from '@atlaskit/editor-common/types';

type InputMethod = INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR;
export const outdentList =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (
    inputMethod: InputMethod = INPUT_METHOD.KEYBOARD,
    featureFlags: FeatureFlags,
  ): Command => {
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

      // Save the history, so it could undo/revert to the same state before the outdent, see https://product-fabric.atlassian.net/browse/ED-14753
      closeHistory(state.tr);

      const actionSubjectId = isBulletList(parentListNode.node)
        ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
        : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

      let customTr: Transaction = state.tr;
      outdentListAction(customTr, state, featureFlags);
      if (!customTr || !customTr.docChanged) {
        // Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
        // If inside table cell and can't outdent list, then let it handle by table keymap
        return !isInsideTableCell(state);
      }

      const restartListsAttributes: RestartListAttributes = {};
      if (featureFlags?.restartNumberedLists) {
        const { outdentScenario, splitListStartNumber } =
          getRestartListsAttributes(customTr);
        if (outdentScenario === OUTDENT_SCENARIOS.SPLIT_LIST) {
          restartListsAttributes.outdentScenario = outdentScenario;
          restartListsAttributes.splitListStartNumber = splitListStartNumber;
        }
      }

      editorAnalyticsAPI?.attachAnalyticsEvent({
        action: ACTION.OUTDENTED,
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          ...getCommonListAnalyticsAttributes(state),
          ...restartListsAttributes,

          inputMethod,
        },
      })(customTr);

      if (dispatch) {
        dispatch(customTr);
      }

      return true;
    };
  };
