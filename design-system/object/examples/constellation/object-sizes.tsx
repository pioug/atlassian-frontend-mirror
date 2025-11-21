import React from 'react';

import TaskObject from '@atlaskit/object/task';
import { Inline } from '@atlaskit/primitives/compiled';

export default function ObjectSizes(): React.JSX.Element {
	return (
		<Inline space="space.100" alignBlock="end">
			<TaskObject size="small" label="Small task object (12px)" />
			<TaskObject size="medium" label="Medium task object (16px)" />
		</Inline>
	);
}
