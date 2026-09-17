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
import { isInsideListItem } from '../utils/selection';

type InputMethod = INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB;

/**
 * Handler for flexible list indentation.
 * Allows indenting the first item by creating wrapper structures.
 */
const handleIndentListItems = (
	tr: Transaction,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	inputMethod: InputMethod,
): Transaction | null => {
	moveSelectedListItems(tr, 1);

	// If no changes were made, return PassiveTransaction to prevent browser from handling this as a tab key event (e.g. moving focus)
	if (!tr.docChanged) {
		return new PassiveTransaction();
	}

	const {
		selection: { $from },
	} = tr;
	const currentListNode = findFirstParentListNode($from)?.node;
	const actionSubjectId =
		currentListNode && isBulletList(currentListNode)
			? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
			: ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

	editorAnalyticsAPI?.attachAnalyticsEvent({
		action: ACTION.INDENTED,
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

export const indentList =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(inputMethod: InputMethod = INPUT_METHOD.KEYBOARD): EditorCommand => {
		return function ({ tr }) {
			// don't indent if selection is not inside a list
			if (!isInsideListItem(tr)) {
				return null;
			}

			// Save the history, so it could undo/revert to the same state before the indent, see https://product-fabric.atlassian.net/browse/ED-14753
			closeHistory(tr);

			return handleIndentListItems(tr, editorAnalyticsAPI, inputMethod);
		};
	};
