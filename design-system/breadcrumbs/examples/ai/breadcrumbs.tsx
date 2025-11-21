import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';

const _default_1: React.JSX.Element[] = [
	<Breadcrumbs maxItems={3}>
		<BreadcrumbsItem href="/" text="Home" />
		<BreadcrumbsItem href="/category" text="Category" />
		<BreadcrumbsItem href="/category/products" text="Products" />
		<BreadcrumbsItem text="Current Page" />
	</Breadcrumbs>,
];
export default _default_1;
