import React from 'react';

import { token } from '@atlaskit/tokens';

import Skeleton from '../../src';

export default () => (
	<Skeleton
		width="200px"
		height="16px"
		color={token('color.background.accent.gray.subtle')}
		testId="skeleton"
	/>
);
