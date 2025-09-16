import React from 'react';

import { ProgressTracker } from '@atlaskit/progress-tracker';

export default [
	<ProgressTracker
		items={[
			{ id: 'step1', label: 'Step 1', status: 'visited', percentageComplete: 100 },
			{ id: 'step2', label: 'Step 2', status: 'current', percentageComplete: 40 },
			{ id: 'step3', label: 'Step 3', status: 'disabled', percentageComplete: 0 },
			{ id: 'step4', label: 'Step 4', status: 'unvisited', percentageComplete: 0 },
		]}
	/>,
];
