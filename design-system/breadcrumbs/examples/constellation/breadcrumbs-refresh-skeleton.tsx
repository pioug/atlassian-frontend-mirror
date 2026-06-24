import React, { useState } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import { BreadcrumbsSkeleton } from '@atlaskit/breadcrumbs/breadcrumbs-skeleton';
import { BreadcrumbsSkeletonItem } from '@atlaskit/breadcrumbs/breadcrumbs-skeleton-item';
import Button from '@atlaskit/button/new';
import { Stack } from '@atlaskit/primitives/compiled';

const BreadcrumbsRefreshSkeletonExample = (): React.JSX.Element => {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<Stack space="space.200" alignInline="start">
			<Button onClick={() => setIsLoading((loading) => !loading)}>
				{isLoading ? 'Show loaded breadcrumbs' : 'Show loading breadcrumbs'}
			</Button>
			{isLoading ? (
				<BreadcrumbsSkeleton>
					<BreadcrumbsSkeletonItem width={96} />
					<BreadcrumbsSkeletonItem width={120} />
					<BreadcrumbsSkeletonItem width={80} />
				</BreadcrumbsSkeleton>
			) : (
				<Breadcrumbs>
					<BreadcrumbsItem href="/components" text="Components" />
					<BreadcrumbsItem href="/components/breadcrumbs" text="Breadcrumbs" />
					<BreadcrumbsCurrentItem href="/components/breadcrumbs/examples" text="Examples" />
				</Breadcrumbs>
			)}
		</Stack>
	);
};

export default BreadcrumbsRefreshSkeletonExample;
