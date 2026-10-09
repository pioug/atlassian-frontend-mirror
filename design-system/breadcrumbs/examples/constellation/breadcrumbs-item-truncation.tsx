import React from 'react';

import Breadcrumbs from '@atlaskit/breadcrumbs/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import { BreadcrumbsItem } from '@atlaskit/breadcrumbs/breadcrumbs-item';

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
