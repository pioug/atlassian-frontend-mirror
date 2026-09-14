import React from 'react';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import {
	ACTION_MENU_ITEM,
	DECISION_MENU_ITEM,
	STRUCTURE_SECTION,
} from '@atlaskit/editor-common/quick-insert/keys';
import { STRUCTURE_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { TasksAndDecisionsPlugin } from '../../tasksAndDecisionsPluginType';

import { TasksAndDecisionsQuickInsertMenuItem } from './TasksAndDecisionsQuickInsertMenuItem';

export const getTasksAndDecisionsQuickInsertComponents = ({
	api,
	quickInsertActionDescription,
}: {
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
	quickInsertActionDescription?: string;
}): RegisterMenuItem[] => [
	{
		key: ACTION_MENU_ITEM.key,
		type: ACTION_MENU_ITEM.type,
		parents: [
			{
				key: STRUCTURE_SECTION.key,
				type: STRUCTURE_SECTION.type,
				rank: STRUCTURE_SECTION_RANK[ACTION_MENU_ITEM.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: quickInsertActionDescription ?? formatMessage(messages.actionDescription),
			keywords: ['checkbox', 'task', 'todo'],
			shortcut: '[]',
			title: formatMessage(messages.action),
		})),
		component: () => <TasksAndDecisionsQuickInsertMenuItem api={api} item="taskList" />,
	},
	{
		key: DECISION_MENU_ITEM.key,
		type: DECISION_MENU_ITEM.type,
		parents: [
			{
				key: STRUCTURE_SECTION.key,
				type: STRUCTURE_SECTION.type,
				rank: STRUCTURE_SECTION_RANK[DECISION_MENU_ITEM.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(messages.decisionDescription),
			keywords: [],
			shortcut: '<>',
			title: formatMessage(messages.decision),
		})),
		component: () => <TasksAndDecisionsQuickInsertMenuItem api={api} item="decisionList" />,
	},
];
