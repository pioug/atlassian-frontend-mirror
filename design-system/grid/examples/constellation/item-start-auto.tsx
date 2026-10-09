import React from 'react';

import Grid from '@atlaskit/grid/grid';
import { GridItem } from '@atlaskit/grid/grid-item';

import { SkeletonBox } from './shared/skeleton-box';

export default (): React.JSX.Element => (
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
