/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Skeleton } from '@atlaskit/linking-common';

export const AssetsAqlSearchInputSkeleton = () => (
	<Skeleton
		width="100%"
		height="40px"
		testId="assets-datasource-modal--aql-search-input-skeleton"
	/>
);
