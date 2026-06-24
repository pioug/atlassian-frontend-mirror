import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';

const BreadcrumbsMaxItemsExample = (): React.JSX.Element => {
	return (
		<Breadcrumbs maxItems={3}>
			<BreadcrumbsItem href="/item" text="Item 1" />
			<BreadcrumbsItem href="/item" text="Item 2" />
			<BreadcrumbsItem href="/item" text="Item 3" />
			<BreadcrumbsItem href="/item" text="Item 4" />
			<BreadcrumbsItem href="/item" text="Item 5" />
			<BreadcrumbsCurrentItem href="/item" text="Item 6" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsMaxItemsExample;
