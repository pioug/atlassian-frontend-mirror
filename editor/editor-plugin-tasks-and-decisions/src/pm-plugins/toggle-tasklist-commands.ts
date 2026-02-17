import { uuid } from '@atlaskit/adf-schema';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { getCommonListAnalyticsAttributes } from '@atlaskit/editor-common/lists';
import {
	transformBetweenListTypes,
	transformToTaskList,
	transformTaskListToBlockNodes,
	isBulletOrOrderedList,
	isTaskList,
	getFormattedNode,
} from '@atlaskit/editor-common/transforms';
import type { TransformContext } from '@atlaskit/editor-common/transforms';
import type { EditorCommand } from '@atlaskit/editor-common/types';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';

export const toggleTaskList =
	(editorAnalyticsAPI?: EditorAnalyticsAPI) =>
	(targetType: 'orderedList' | 'bulletList' | 'paragraph' = 'paragraph'): EditorCommand => {
		return ({ tr }) => {
			const inputMethod = INPUT_METHOD.TOOLBAR;
			const { nodes } = tr.doc.type.schema;
			const { selection } = tr;

			// Handle empty selection: insert a new task item
			const { $from } = selection;
			const isEmpty = $from.parent.content.size === 0;

			if (isEmpty && nodes.taskList && nodes.taskItem) {
				// Create an empty task list with one empty task item
				const listLocalId = uuid.generate();
				const itemLocalId = uuid.generate();
				const emptyList = nodes.taskList.create({ localId: listLocalId }, [
					nodes.taskItem.create({ localId: itemLocalId }),
				]);

				// Insert the empty list at the current selection
				const insertTr = safeInsert(emptyList)(tr);
				if (insertTr !== tr) {
					if (fg('platform_editor_toolbar_task_list_analytics')) {
						// Fire INSERT analytics event when creating a new task list
						editorAnalyticsAPI?.attachAnalyticsEvent({
							action: ACTION.INSERTED,
							actionSubject: ACTION_SUBJECT.DOCUMENT,
							actionSubjectId: ACTION_SUBJECT_ID.ACTION,
							eventType: EVENT_TYPE.TRACK,
							attributes: {
								inputMethod,
								listLocalId,
								listSize: 1,
								localId: itemLocalId,
								position: 0,
							},
						})(insertTr);
					}

					// Set cursor inside the new task item
					const insertPos = insertTr.selection.$from.pos;
					return insertTr.setSelection(TextSelection.near(insertTr.doc.resolve(insertPos)));
				}
			}

			const { node, pos } = getFormattedNode(tr);

			if (node !== null && pos !== null) {
				if (isBulletOrOrderedList(node.type)) {
					const transformedFrom =
						node.type.name === 'bulletList'
							? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
							: ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

					const context: TransformContext = {
						sourceNode: node,
						sourcePos: pos,
						targetNodeType: nodes.taskList,
						tr,
					};

					const resultTr = transformBetweenListTypes(context);

					if (fg('platform_editor_toolbar_task_list_analytics')) {
						// Fire CONVERTED analytics event when transforming a list to task list
						if (resultTr && resultTr.docChanged) {
							editorAnalyticsAPI?.attachAnalyticsEvent({
								action: ACTION.CONVERTED,
								actionSubject: ACTION_SUBJECT.LIST,
								actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
								eventType: EVENT_TYPE.TRACK,
								attributes: {
									...getCommonListAnalyticsAttributes(tr),
									transformedFrom,
									inputMethod,
								},
							})(resultTr);
						}
					}

					return resultTr;
				}

				if (isTaskList(node.type)) {
					const context: TransformContext = {
						sourceNode: node,
						sourcePos: pos,
						targetNodeType: nodes[targetType],
						tr,
					};
					const resultTr =
						targetType === 'paragraph'
							? transformTaskListToBlockNodes(context)
							: transformBetweenListTypes(context);

					// Fire CONVERTED analytics event when transforming from task list
					if (resultTr && resultTr.docChanged && targetType !== 'paragraph') {
						const transformedFrom = ACTION_SUBJECT_ID.FORMAT_LIST_BULLET;
						const targetListType =
							targetType === 'bulletList'
								? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
								: ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

						if (fg('platform_editor_toolbar_task_list_analytics')) {
							editorAnalyticsAPI?.attachAnalyticsEvent({
								action: ACTION.CONVERTED,
								actionSubject: ACTION_SUBJECT.LIST,
								actionSubjectId: targetListType,
								eventType: EVENT_TYPE.TRACK,
								attributes: {
									...getCommonListAnalyticsAttributes(tr),
									transformedFrom,
									inputMethod,
								},
							})(resultTr);
						}
					}

					return resultTr;
				}
				const { $from, $to } = selection;
				const range = $from.blockRange($to);
				if (range) {
					const resultTr = transformToTaskList(tr, range, nodes.taskList, undefined, nodes);

					// Fire INSERT analytics event when creating task list from selection
					if (resultTr && resultTr.docChanged) {
						const listNode = resultTr.doc.nodeAt(range.start);
						const listLocalIdFromNode = listNode?.attrs?.localId ?? uuid.generate();
						const listSizeFromNode = listNode?.childCount ?? 0;
						const localIdFromNode = listNode?.firstChild?.attrs?.localId ?? uuid.generate();

						if (fg('platform_editor_toolbar_task_list_analytics')) {
							editorAnalyticsAPI?.attachAnalyticsEvent({
								action: ACTION.INSERTED,
								actionSubject: ACTION_SUBJECT.DOCUMENT,
								actionSubjectId: ACTION_SUBJECT_ID.ACTION,
								eventType: EVENT_TYPE.TRACK,
								attributes: {
									inputMethod,
									listLocalId: listLocalIdFromNode,
									listSize: listSizeFromNode,
									localId: localIdFromNode,
									position: 0,
								},
							})(resultTr);
						}
					}

					return resultTr;
				}
			}

			return tr;
		};
	};
