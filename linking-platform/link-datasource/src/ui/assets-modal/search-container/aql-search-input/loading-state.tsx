import React from 'react';

import { Skeleton } from '@atlaskit/linking-common';

export const AssetsAqlSearchInputSkeleton = (): React.JSX.Element => (
	<Skeleton
		width="100%"
		height="40px"
		testId="assets-datasource-modal--aql-search-input-skeleton"
	/>
);
