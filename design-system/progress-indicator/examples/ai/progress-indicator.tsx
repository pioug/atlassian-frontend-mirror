import React from 'react';

import ProgressIndicator from '@atlaskit/progress-indicator/progress-dots';

const Examples = (): React.JSX.Element => (
	<>
		<ProgressIndicator selectedIndex={1} values={['Step 1', 'Step 2', 'Step 3']} />
		<ProgressIndicator selectedIndex={2} values={['Start', 'In Progress', 'Complete']} />
	</>
);
export default Examples;
