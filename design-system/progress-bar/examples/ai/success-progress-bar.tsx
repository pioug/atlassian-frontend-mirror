import React from 'react';

import { SuccessProgressBar } from '@atlaskit/progress-bar';

const Examples = (): React.JSX.Element => (
	<>
		<SuccessProgressBar value={1.0} />
		<SuccessProgressBar value={0.9} />
	</>
);
export default Examples;
