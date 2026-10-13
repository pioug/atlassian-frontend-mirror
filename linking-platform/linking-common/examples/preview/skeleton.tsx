import React from 'react';

import { Skeleton } from '@atlaskit/linking-common/skeleton';

export default function SkeletonPreview(): React.JSX.Element {
	return (
		<div data-testid="component-preview" aria-busy="true">
			<div aria-hidden="true">
				<Skeleton width="240px" height="18px" />
			</div>
		</div>
	);
}
