import React from 'react';

import Skeleton from '@atlaskit/skeleton';
import { token } from '@atlaskit/tokens';

export default (): React.JSX.Element => (
	<Skeleton
		width="200px"
		height="16px"
		color={token('color.background.accent.gray.subtle')}
		testId="skeleton"
	/>
);
