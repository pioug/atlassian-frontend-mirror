import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
	getCommonListAnalyticsAttributes,
	getListItemAttributes,
	hasValidListIndentationLevel,
} from '@atlaskit/editor-common/lists';
import { PassiveTransaction } from '@atlaskit/editor-common/preset';
import type { EditorCommand } from '@atlaskit/editor-common/types';
import { isBulletList } from '@atlaskit/editor-common/utils';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { closeHistory } from '@atlaskit/prosemirror-history';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { MAX_NESTED_LIST_INDENTATION } from '../../types';
import { indentListItemsSelected as indentListAction } from '../actions/indent-list-items-selected';
import { moveSelectedListItems } from '../actions/move-selected-list-items';
import { findFirstParentListNode } from '../utils/find';
import { isInsideListItem, isInsideTableCell } from '../utils/selection';

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
			const {
				selection: { $from },
			} = tr;

			// don't indent if selection is not inside a list
			if (!isInsideListItem(tr)) {
				return null;
			}

			// Save the history, so it could undo/revert to the same state before the indent, see https://product-fabric.atlassian.net/browse/ED-14753
			closeHistory(tr);

			// Route to new or original implementation based on feature flag
			if (expValEqualsNoExposure('platform_editor_flexible_list_indentation', 'isEnabled', true)) {
				return handleIndentListItems(tr, editorAnalyticsAPI, inputMethod);
			}

			const firstListItemSelectedAttributes = getListItemAttributes($from);
			const parentListNode = findFirstParentListNode($from);

			if (
				!parentListNode ||
				(firstListItemSelectedAttributes &&
					firstListItemSelectedAttributes.indentLevel === 0 &&
					firstListItemSelectedAttributes.itemIndex === 0)
			) {
				if (isInsideTableCell(tr)) {
					// dont consume tab, as table-keymap should move cursor to next cell
					return null;
				} else {
					// Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
					return new PassiveTransaction();
				}
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
				return new PassiveTransaction();
			}

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
	};
