import React from 'react';

import Grid, { GridItem } from '@atlaskit/grid';

import { SkeletonBox } from './shared/skeleton-box';

export default (): React.JSX.Element => (
	<Grid>
		<GridItem span={8} start={3}>
			<SkeletonBox>centered</SkeletonBox>
		</GridItem>

		<GridItem span={8} start={{ lg: 3 }}>
			<SkeletonBox>centered on desktop</SkeletonBox>
		</GridItem>

		<GridItem span={{ xxs: 6 }} start={7}>
			<SkeletonBox>forced right</SkeletonBox>
		</GridItem>
	</Grid>
);
