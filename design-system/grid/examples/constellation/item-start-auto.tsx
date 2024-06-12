import React from 'react';

import Grid, { GridItem } from '../../src';

import { SkeletonBox } from './shared/skeleton-box';

export default () => (
	<Grid>
		<GridItem span={4} start={{ xxs: 5, md: 'auto' }}>
			<SkeletonBox>
				centered xs+
				<br />
				auto md+
			</SkeletonBox>
		</GridItem>
	</Grid>
);
