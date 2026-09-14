import React from 'react';

import { TaskList, TaskItem } from '../../';

export const TaskListEditor = (): React.JSX.Element => (
	<TaskList listId="list-1">
		<TaskItem taskId="task-1" isDone={false}>
			Hello <b>world</b>
		</TaskItem>
		<TaskItem taskId="task-2" isDone={true}>
			Enjoy <b>life</b>
		</TaskItem>
	</TaskList>
);

export const TaskListSingleTaskEditor = (): React.JSX.Element => (
	<TaskList listId="list-1">
		<TaskItem taskId="task-1" isDone={false}>
			Hello <b>world</b>
		</TaskItem>
	</TaskList>
);

export const TaskListEmptyEditor = (): React.JSX.Element => <TaskList listId="list-1" />;
