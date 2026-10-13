import React from 'react';

import { IntlProvider } from 'react-intl';

import ResourcedTaskItem from '@atlaskit/task-decision/resourced-task-item';
import type { Handler } from '@atlaskit/task-decision/types';
import type { ObjectKey } from '@atlaskit/task-decision/types';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';
import type { TaskState } from '@atlaskit/task-decision/types';

const getKey = ({ localId, objectAri }: ObjectKey) => `${objectAri}:${localId}`;

function createLocalProvider(): TaskDecisionProvider {
	const states = new Map<string, TaskState>();
	const subscribers = new Map<string, Set<Handler>>();

	return {
		notifyRecentUpdates: () => undefined,
		subscribe: (objectKey, handler, item) => {
			const key = getKey(objectKey);
			const handlers = subscribers.get(key) ?? new Set<Handler>();
			handlers.add(handler);
			subscribers.set(key, handlers);

			const state = states.get(key) ?? (item?.state === 'DONE' ? 'DONE' : 'TODO');
			states.set(key, state);
			handler(state);
		},
		toggleTask: async (objectKey, state) => {
			const key = getKey(objectKey);
			states.set(key, state);
			subscribers.get(key)?.forEach((handler) => handler(state));
			return state;
		},
		unsubscribe: (objectKey, handler) => {
			subscribers.get(getKey(objectKey))?.delete(handler);
		},
		unsubscribeRecentUpdates: () => undefined,
	};
}

export default function ResourcedTaskItemPreview(): React.JSX.Element {
	const provider = React.useMemo(() => Promise.resolve(createLocalProvider()), []);

	return (
		<IntlProvider locale="en">
			<div data-testid="component-preview">
				<h2>Launch readiness</h2>
				<p>Local preview only; this sample provider does not persist task state.</p>
				<ResourcedTaskItem
					taskId="confirm-support-readiness"
					objectAri="ari:cloud:sample::object/launch-plan"
					taskDecisionProvider={provider}
				>
					Confirm the support team has the launch guide.
				</ResourcedTaskItem>
			</div>
		</IntlProvider>
	);
}
