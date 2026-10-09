import React from 'react';

import Grid from '@atlaskit/grid/grid';
import { GridItem } from '@atlaskit/grid/grid-item';

import { SkeletonBox } from './shared/skeleton-box';

export default (): React.JSX.Element => (
	<Grid maxWidth="wide">
		<GridItem span={{ sm: 6, md: 4 }}>
			<SkeletonBox>sm=6 md=4</SkeletonBox>
		</GridItem>
		<GridItem span={{ sm: 6, md: 4 }}>
			<SkeletonBox>sm=6 md=4</SkeletonBox>
		</GridItem>
		<GridItem span={{ md: 4 }}>
			<SkeletonBox>sm=12 md=4</SkeletonBox>
		</GridItem>
		<GridItem span={{ md: 6 }}>
			<SkeletonBox>sm=12 md=6</SkeletonBox>
		</GridItem>
		<GridItem span={{ md: 6 }}>
			<SkeletonBox>sm=12 md=6</SkeletonBox>
		</GridItem>
	</Grid>
);
