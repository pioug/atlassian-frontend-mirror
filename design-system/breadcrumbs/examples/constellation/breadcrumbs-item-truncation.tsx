import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';

const BreadcrumbsItemTruncationExample = (): React.JSX.Element => {
	return (
		<Breadcrumbs>
			<BreadcrumbsItem text="Confluence" />
			<BreadcrumbsItem
				truncationWidth={100}
				text="The new Confluence experience will soon be on for everyone"
			/>
			<BreadcrumbsCurrentItem href="/current-page" text="Current page" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsItemTruncationExample;
