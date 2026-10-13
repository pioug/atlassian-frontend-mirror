import React, { useState } from 'react';

import { IntlProvider } from 'react-intl';

import TaskItem from '@atlaskit/task-decision/task-item';
import TaskList from '@atlaskit/task-decision/task-list';

const initialTasks = [
	{ id: 'agenda', label: 'Share the planning agenda' },
	{ id: 'notes', label: 'Send the meeting notes to the team' },
];

export default function TaskListExample(): React.JSX.Element {
	const [completedTasks, setCompletedTasks] = useState<string[]>([]);

	const updateTask = (taskId: string, isDone: boolean) => {
		setCompletedTasks((current) =>
			isDone ? [...current, taskId] : current.filter((id) => id !== taskId),
		);
	};

	return (
		<IntlProvider locale="en">
			<section>
				<h2>Meeting follow-up</h2>
				<TaskList listId="meeting-follow-up">
					{initialTasks.map(({ id, label }) => (
						<TaskItem
							key={id}
							taskId={id}
							isDone={completedTasks.includes(id)}
							onChange={updateTask}
						>
							{label}
						</TaskItem>
					))}
				</TaskList>
			</section>
		</IntlProvider>
	);
}
