import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';

export default [
	<Breadcrumbs maxItems={3}>
		<BreadcrumbsItem href="/" text="Home" />
		<BreadcrumbsItem href="/category" text="Category" />
		<BreadcrumbsItem href="/category/products" text="Products" />
		<BreadcrumbsItem text="Current Page" />
	</Breadcrumbs>,
];
