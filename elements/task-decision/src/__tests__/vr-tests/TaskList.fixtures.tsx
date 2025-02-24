import React from 'react';

import { TaskList, TaskItem } from '../../';

export const TaskListEditor = () => (
	<TaskList listId="list-1">
		<TaskItem taskId="task-1" isDone={false}>
			Hello <b>world</b>
		</TaskItem>
		<TaskItem taskId="task-2" isDone={true}>
			Enjoy <b>life</b>
		</TaskItem>
	</TaskList>
);

export const TaskListSingleTaskEditor = () => (
	<TaskList listId="list-1">
		<TaskItem taskId="task-1" isDone={false}>
			Hello <b>world</b>
		</TaskItem>
	</TaskList>
);

export const TaskListEmptyEditor = () => <TaskList listId="list-1" />;
