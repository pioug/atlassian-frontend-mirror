import type { Inline } from '@atlaskit/adf-schema/inline-content';
import type { TaskItemDefinition } from '@atlaskit/adf-schema/task-item';

export const taskItem =
	(attrs: TaskItemDefinition['attrs']) =>
	(...content: Array<Inline>): TaskItemDefinition => ({
		type: 'taskItem',
		attrs,
		content,
	});
