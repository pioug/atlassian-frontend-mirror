import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import { ReactRenderer as Renderer } from '@atlaskit/renderer';
import { document } from '@atlaskit/util-data-test/task-decision-story-data';

import { dumpRef, TaskStateManager } from '../example-helpers/story-utils';
import { TaskList } from '../src';
import { TaskItem } from '../src';

export default (): React.JSX.Element => (
	<div>
		<h3>Simple TaskList</h3>
		<TaskStateManager
			render={(taskStates, onChangeListener) => (
				<TaskList>
					<TaskItem
						contentRef={dumpRef}
						taskId="task-1"
						onChange={onChangeListener}
						isDone={taskStates.get('task-1')}
					>
						Hello <b>world</b>.
					</TaskItem>
					<TaskItem
						contentRef={dumpRef}
						taskId="task-2"
						onChange={onChangeListener}
						isDone={taskStates.get('task-2')}
					>
						<Renderer document={document as DocNode} />
					</TaskItem>
					<TaskItem
						contentRef={dumpRef}
						taskId="task-3"
						onChange={onChangeListener}
						isDone={taskStates.get('task-3')}
					>
						Oh God Why
					</TaskItem>
				</TaskList>
			)}
		/>
		<h3>Single item TaskList</h3>
		<TaskStateManager
			render={(taskStates, onChangeListener) => (
				<TaskList>
					<TaskItem
						contentRef={dumpRef}
						taskId="task-5"
						onChange={onChangeListener}
						isDone={taskStates.get('task-5')}
					>
						Hello <b>world</b>.
					</TaskItem>
				</TaskList>
			)}
		/>

		<h3>Empty TaskList</h3>
		<TaskList />
	</div>
);
