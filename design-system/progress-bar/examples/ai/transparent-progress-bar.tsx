import React from 'react';

import { TransparentProgressBar } from '@atlaskit/progress-bar';

const Examples = (): React.JSX.Element => (
	<>
		<TransparentProgressBar value={0.6} />
		<TransparentProgressBar value={0.3} />
	</>
);
export default Examples;
