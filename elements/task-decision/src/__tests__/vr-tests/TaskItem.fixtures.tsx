import React from 'react';
import type { DocNode } from '@atlaskit/adf-schema';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactRenderer as Renderer } from '@atlaskit/renderer';
import { document } from '@atlaskit/util-data-test/task-decision-story-data';

import { TaskItem } from '../../../src';
import { dumpRef, action } from '../../../example-helpers/story-utils';

export const TaskItemEditor = (): React.JSX.Element => (
	<TaskItem taskId="task-1" contentRef={dumpRef} onChange={action('onChange')}>
		Task item
	</TaskItem>
);

export const TaskItemDoneEditor = (): React.JSX.Element => (
	<TaskItem taskId="task-2" contentRef={dumpRef} isDone={true} onChange={action('onChange')}>
		Task item completed
	</TaskItem>
);

export const TaskItemRenderer = (): React.JSX.Element => (
	<TaskItem taskId="task-3" contentRef={dumpRef} onChange={action('onChange')}>
		<Renderer document={document as DocNode} />
	</TaskItem>
);

export const TaskItemDoneRenderer = (): React.JSX.Element => (
	<TaskItem taskId="task-4" contentRef={dumpRef} isDone={true} onChange={action('onChange')}>
		<Renderer document={document as DocNode} />
	</TaskItem>
);
