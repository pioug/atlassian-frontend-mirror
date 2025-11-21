import React from 'react';

import ProgressBar from '@atlaskit/progress-bar';

const ProgressBarSuccessExample = (): React.JSX.Element => {
	return <ProgressBar appearance="success" ariaLabel="Done: 10 of 10 work items" value={1} />;
};

export default ProgressBarSuccessExample;
