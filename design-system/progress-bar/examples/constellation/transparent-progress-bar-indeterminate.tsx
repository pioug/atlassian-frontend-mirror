import React from 'react';

import { TransparentProgressBar } from '@atlaskit/progress-bar';

const TransparentProgressBarIndeterminateExample = (): React.JSX.Element => {
	return <TransparentProgressBar ariaLabel="Loading work items" isIndeterminate />;
};

export default TransparentProgressBarIndeterminateExample;
