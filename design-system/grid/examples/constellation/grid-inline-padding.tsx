import React from 'react';

import Grid, { GridItem } from '../../src';

import { SkeletonBox } from './shared/skeleton-box';

export default () => (
	<>
		<Grid maxWidth="wide" hasInlinePadding={true}>
			<GridItem span={12}>
				<SkeletonBox>with padding</SkeletonBox>
			</GridItem>
		</Grid>
		<Grid maxWidth="wide" hasInlinePadding={false}>
			<GridItem span={12}>
				<SkeletonBox>without padding</SkeletonBox>
			</GridItem>
		</Grid>
	</>
);
