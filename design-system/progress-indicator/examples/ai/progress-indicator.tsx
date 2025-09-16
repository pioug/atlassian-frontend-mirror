import React from 'react';

import { ProgressIndicator } from '@atlaskit/progress-indicator';

export default [
	<ProgressIndicator selectedIndex={1} values={['Step 1', 'Step 2', 'Step 3']} />,
	<ProgressIndicator selectedIndex={2} values={['Start', 'In Progress', 'Complete']} />,
];
