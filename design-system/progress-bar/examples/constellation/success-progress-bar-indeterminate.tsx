import React from 'react';

import { SuccessProgressBar } from '@atlaskit/progress-bar';

const SuccessProgressBarIndeterminateExample = (): React.JSX.Element => {
	return <SuccessProgressBar ariaLabel="Loading work items" isIndeterminate />;
};

export default SuccessProgressBarIndeterminateExample;
