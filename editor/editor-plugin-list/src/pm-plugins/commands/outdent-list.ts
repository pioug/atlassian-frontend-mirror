import type {
	EditorAnalyticsAPI,
	RestartListsAttributesForListOutdented as RestartListAttributes,
} from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	OUTDENT_SCENARIOS,
} from '@atlaskit/editor-common/analytics';
import { getCommonListAnalyticsAttributes } from '@atlaskit/editor-common/lists';
import { PassiveTransaction } from '@atlaskit/editor-common/preset';
import type { EditorCommand } from '@atlaskit/editor-common/types';
import { isBulletList } from '@atlaskit/editor-common/utils';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { closeHistory } from '@atlaskit/prosemirror-history';

import { outdentListItemsSelected as outdentListAction } from '../actions/outdent-list-items-selected';
import { getRestartListsAttributes } from '../utils/analytics';
import { findFirstParentListNode } from '../utils/find';
import { isInsideListItem, isInsideTableCell } from '../utils/selection';

type InputMethod = INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB;
export const outdentList =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(inputMethod: InputMethod = INPUT_METHOD.KEYBOARD): EditorCommand => {
		return function ({ tr }) {
			if (!isInsideListItem(tr)) {
				return null;
			}
			const { $from } = tr.selection;
			const parentListNode = findFirstParentListNode($from);
			if (!parentListNode) {
				// Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
				return new PassiveTransaction();
			}

			// Save the history, so it could undo/revert to the same state before the outdent, see https://product-fabric.atlassian.net/browse/ED-14753
			closeHistory(tr);

			const actionSubjectId = isBulletList(parentListNode.node)
				? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
				: ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

			const customTr: Transaction = tr;
			outdentListAction(customTr);
			if (!customTr || !customTr.docChanged) {
				// Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
				// If inside table cell and can't outdent list, then let it handle by table keymap
				return !isInsideTableCell(customTr) ? new PassiveTransaction() : null;
			}

			const restartListsAttributes: RestartListAttributes = {};
			const { outdentScenario, splitListStartNumber } = getRestartListsAttributes(customTr);
			if (outdentScenario === OUTDENT_SCENARIOS.SPLIT_LIST) {
				restartListsAttributes.outdentScenario = outdentScenario;
				restartListsAttributes.splitListStartNumber = splitListStartNumber;
			}

			editorAnalyticsAPI?.attachAnalyticsEvent({
				action: ACTION.OUTDENTED,
				actionSubject: ACTION_SUBJECT.LIST,
				actionSubjectId,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					...getCommonListAnalyticsAttributes(customTr),
					...restartListsAttributes,

					inputMethod,
				},
			})(customTr);

			return customTr;
		};
	};
