import React from 'react';

import { SuccessProgressBar } from '@atlaskit/progress-bar';

const SuccessProgressBarCompleteExample = (): React.JSX.Element => {
	return <SuccessProgressBar ariaLabel="Done: 10 of 10 work items" value={1} />;
};

export default SuccessProgressBarCompleteExample;
