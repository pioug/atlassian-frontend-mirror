import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';

export default () => (
	// with markup in content
	<Breadcrumbs testId="BreadcrumbsTestId">
		<BreadcrumbsItem href="/page" text="<b>Page</b>" />
		<BreadcrumbsItem href="/page" text="<script>alert();</script>" />
	</Breadcrumbs>
);
