import React from 'react';

import { Skeleton } from '@atlaskit/linking-common/skeleton';

export default function BlockSkeletonExample(): React.JSX.Element {
	return (
		<div aria-busy="true">
			<p role="status">Loading project details</p>
			<div aria-hidden="true">
				<Skeleton width="280px" height="20px" />
				<Skeleton width="180px" height="14px" />
			</div>
		</div>
	);
}
