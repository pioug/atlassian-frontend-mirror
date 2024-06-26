import { type ServiceTask, type Task } from '../../types';

import { convertServiceTaskToTask } from '../../api/TaskDecisionUtils';

import addMinutes from 'date-fns/addMinutes';

import { getServiceTasksResponse } from '@atlaskit/util-data-test/task-decision-story-data';

export {
	getServiceTasksResponse,
	getParticipants,
} from '@atlaskit/util-data-test/task-decision-story-data';

export interface GetItemsResponseOptions {
	hasMore?: boolean;
	idOffset?: number;
	dateField?: string;
	groupByDateSize?: number;
}

export const serviceTask: ServiceTask = getServiceTasksResponse().tasks[0];

export const buildServiceTask = (part: Partial<ServiceTask>): ServiceTask => {
	return {
		...serviceTask,
		...part,
	};
};
export const task: Task = convertServiceTaskToTask(serviceTask);

export const buildTask = (part: Partial<Task>): Task => {
	return {
		...task,
		...part,
	};
};

export const content = (text: string): any => ({
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text,
				},
			],
		},
	],
});

export const datePlus = (minutes: number): Date => addMinutes(new Date(), minutes);
