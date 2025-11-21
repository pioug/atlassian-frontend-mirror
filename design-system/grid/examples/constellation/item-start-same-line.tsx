import React from 'react';

import Grid, { GridItem } from '@atlaskit/grid';

import { SkeletonBox } from './shared/skeleton-box';

export default (): React.JSX.Element => (
	<Grid>
		<GridItem span={4}>
			<SkeletonBox>(left)</SkeletonBox>
		</GridItem>

		<GridItem span={4} start={9}>
			<SkeletonBox>(right)</SkeletonBox>
		</GridItem>
	</Grid>
);
