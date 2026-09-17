import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { getCommonListAnalyticsAttributes } from '@atlaskit/editor-common/lists';
import { PassiveTransaction } from '@atlaskit/editor-common/preset';
import type { EditorCommand } from '@atlaskit/editor-common/types';
import { isBulletList } from '@atlaskit/editor-common/utils';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { closeHistory } from '@atlaskit/prosemirror-history/closeHistory';

import { moveSelectedListItems } from '../actions/move-selected-list-items';
import { findFirstParentListNode } from '../utils/find';
import { isInsideListItem, isInsideTableCell } from '../utils/selection';

type InputMethod = INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB;

/**
 * Handler for flexible list outdentation.
 * Lifts items independently and cleans up wrapper structures.
 */
const handleOutdentListItems = (
	tr: Transaction,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	inputMethod: InputMethod,
): Transaction | null => {
	moveSelectedListItems(tr, -1);

	// If no changes were made, handle based on context
	if (!tr.docChanged) {
		// If inside table cell and can't outdent list, then let it handle by table keymap
		return !isInsideTableCell(tr) ? new PassiveTransaction() : null;
	}

	// Determine the action subject ID from the parent list type
	const {
		selection: { $from },
	} = tr;
	const currentListNode = findFirstParentListNode($from)?.node;
	const actionSubjectId =
		currentListNode && isBulletList(currentListNode)
			? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
			: ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

	// Attach analytics event with flexibleIndentation attribute
	editorAnalyticsAPI?.attachAnalyticsEvent({
		action: ACTION.OUTDENTED,
		actionSubject: ACTION_SUBJECT.LIST,
		actionSubjectId,
		eventType: EVENT_TYPE.TRACK,
		attributes: {
			...getCommonListAnalyticsAttributes(tr),
			inputMethod,
		},
	})(tr);

	return tr;
};

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
				// Keep focus in the editor when there is no parent list to outdent.
				return new PassiveTransaction();
			}
			closeHistory(tr);

			return handleOutdentListItems(tr, editorAnalyticsAPI, inputMethod);
		};
	};
