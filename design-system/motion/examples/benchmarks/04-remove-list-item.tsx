import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import { BenchmarkLayout, BenchmarkSurface } from './shared';

const initialTasks = [
	{ id: 'brief', label: 'Review the project brief' },
	{ id: 'prototype', label: 'Test the prototype' },
	{ id: 'handoff', label: 'Prepare the engineering handoff' },
];

/**
 * Benchmark prompt:
 * Animate a task leaving this list after it is deleted. Other tasks must remain usable while the
 * motion runs.
 */
export default function RemoveListItemBenchmark(): JSX.Element {
	const [tasks, setTasks] = useState(initialTasks);

	return (
		<BenchmarkLayout title="Task list" description="Delete and restore tasks.">
			<Stack space="space.150">
				<ul>
					{tasks.map((task) => (
						<li key={task.id}>
							<BenchmarkSurface>
								<Inline alignBlock="center" spread="space-between">
									<Text>{task.label}</Text>
									<Button
										onClick={() => setTasks((items) => items.filter(({ id }) => id !== task.id))}
									>
										Delete
									</Button>
								</Inline>
							</BenchmarkSurface>
						</li>
					))}
				</ul>
				<Button
					onClick={() => setTasks(initialTasks)}
					isDisabled={tasks.length === initialTasks.length}
				>
					Restore tasks
				</Button>
			</Stack>
		</BenchmarkLayout>
	);
}
