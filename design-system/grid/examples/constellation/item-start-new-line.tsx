import React from 'react';

import Grid from '@atlaskit/grid/grid';
import { GridItem } from '@atlaskit/grid/grid-item';

import { SkeletonBox } from './shared/skeleton-box';

export default (): React.JSX.Element => (
	<Grid>
		<GridItem span={4}>
			<SkeletonBox>Line 1</SkeletonBox>
		</GridItem>

		<GridItem span={4} start={1}>
			<SkeletonBox>Forced to Line 2</SkeletonBox>
		</GridItem>
	</Grid>
);
