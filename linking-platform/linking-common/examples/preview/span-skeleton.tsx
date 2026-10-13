import React from 'react';

import { SpanSkeleton } from '@atlaskit/linking-common/span-skeleton';

export default function SpanSkeletonPreview(): React.JSX.Element {
	return (
		<p data-testid="component-preview">
			Project owner:{' '}
			<span aria-hidden="true">
				<SpanSkeleton width="110px" height="14px" />
			</span>
		</p>
	);
}
