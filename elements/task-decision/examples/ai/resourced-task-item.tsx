import React from 'react';

import { IntlProvider } from 'react-intl';

import ResourcedTaskItem from '@atlaskit/task-decision/resourced-task-item';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';

type ResourcedTaskExampleProps = {
	/** Stable identity of the document or object that owns this task. */
	objectAri: string;
	/** Resolve this with the host's authenticated task-decision provider. */
	taskDecisionProvider: Promise<TaskDecisionProvider>;
};

export default function ResourcedTaskItemExample({
	taskDecisionProvider,
	objectAri,
}: ResourcedTaskExampleProps): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<section>
				<h2>Launch readiness</h2>
				<ResourcedTaskItem
					taskId="confirm-support-readiness"
					objectAri={objectAri}
					taskDecisionProvider={taskDecisionProvider}
				>
					Confirm the support team has the launch guide.
				</ResourcedTaskItem>
			</section>
		</IntlProvider>
	);
}
