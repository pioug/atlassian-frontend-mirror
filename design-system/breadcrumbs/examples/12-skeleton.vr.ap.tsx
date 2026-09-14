import React from 'react';

import { BreadcrumbsSkeleton } from '@atlaskit/breadcrumbs/breadcrumbs-skeleton';
import { BreadcrumbsSkeletonItem } from '@atlaskit/breadcrumbs/breadcrumbs-skeleton-item';
import { Stack } from '@atlaskit/primitives/compiled';

export default function BreadcrumbsSkeletonExample(): React.JSX.Element {
	return (
		<Stack space="space.200">
			<BreadcrumbsSkeleton label="Loading breadcrumbs">
				<BreadcrumbsSkeletonItem width={72} />
				<BreadcrumbsSkeletonItem width={96} />
				<BreadcrumbsSkeletonItem width={84} />
			</BreadcrumbsSkeleton>
			<BreadcrumbsSkeleton label="Loading issue breadcrumbs" size="small">
				<BreadcrumbsSkeletonItem hasIcon width={88} />
				<BreadcrumbsSkeletonItem width={64} />
				<BreadcrumbsSkeletonItem hasIcon width={128} />
			</BreadcrumbsSkeleton>
		</Stack>
	);
}
