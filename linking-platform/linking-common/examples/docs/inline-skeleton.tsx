import React from 'react';

import { SpanSkeleton } from '@atlaskit/linking-common/span-skeleton';

export default function InlineSkeletonExample(): React.JSX.Element {
	return (
		<p aria-busy="true">
			Owner: <span role="status">Loading owner name</span>{' '}
			<span aria-hidden="true"><SpanSkeleton width="120px" height="14px" /></span>
		</p>
	);
}
