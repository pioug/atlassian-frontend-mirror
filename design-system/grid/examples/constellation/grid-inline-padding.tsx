import React from 'react';

import Grid from '@atlaskit/grid/grid';
import { GridItem } from '@atlaskit/grid/grid-item';

import { SkeletonBox } from './shared/skeleton-box';

export default (): React.JSX.Element => (
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
