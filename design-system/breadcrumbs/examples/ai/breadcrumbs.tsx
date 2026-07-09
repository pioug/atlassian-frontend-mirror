import React from 'react';

import Breadcrumbs from '@atlaskit/breadcrumbs/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import { BreadcrumbsItem } from '@atlaskit/breadcrumbs/breadcrumbs-item';

const Example = (): React.JSX.Element => (
	<Breadcrumbs maxItems={3}>
		<BreadcrumbsItem href="/" text="Home" />
		<BreadcrumbsItem href="/category" text="Category" />
		<BreadcrumbsItem href="/category/products" text="Products" />
		<BreadcrumbsCurrentItem href="/category/products/current-page" text="Current Page" />
	</Breadcrumbs>
);
export default Example;
