import React from 'react';

import {
	LISTS_INDENTATION_MENU_SECTION,
	LISTS_INDENTATION_MENU_SECTION_RANK,
	TASK_LIST_MENU_ITEM,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { TasksAndDecisionsPlugin } from '../tasksAndDecisionsPluginType';

import { TaskListMenuItem } from './TaskListMenuItem/TaskListMenuItem';

type GetTasksAndDecisionsToolbarComponentsProps = {
	api?: ExtractInjectionAPI<TasksAndDecisionsPlugin>;
};

export const getTasksAndDecisionsToolbarComponents = ({
	api,
}: GetTasksAndDecisionsToolbarComponentsProps): RegisterComponent[] => {

	return [
		{
			type: TASK_LIST_MENU_ITEM.type,
			key: TASK_LIST_MENU_ITEM.key,
			parents: [
				{
					type: LISTS_INDENTATION_MENU_SECTION.type,
					key: LISTS_INDENTATION_MENU_SECTION.key,
					rank: LISTS_INDENTATION_MENU_SECTION_RANK[TASK_LIST_MENU_ITEM.key],
				},
			],
			component: ({ parents }) => <TaskListMenuItem api={api} parents={parents} />,
		},
	];
};
