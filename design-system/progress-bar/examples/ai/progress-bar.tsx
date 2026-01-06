import React from 'react';

import ProgressBar from '@atlaskit/progress-bar';

const Examples = (): React.JSX.Element => (
	<>
		<ProgressBar value={0.5} />
		<ProgressBar value={0.8} appearance="success" />
	</>
);
export default Examples;
