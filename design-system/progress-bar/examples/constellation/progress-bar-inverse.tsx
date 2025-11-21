import React from 'react';

import ProgressBar from '@atlaskit/progress-bar';

const ProgressBarInverseExample = (): React.JSX.Element => {
	return <ProgressBar appearance="inverse" ariaLabel="Done: 6 of 10 work items" value={0.6} />;
};

export default ProgressBarInverseExample;
