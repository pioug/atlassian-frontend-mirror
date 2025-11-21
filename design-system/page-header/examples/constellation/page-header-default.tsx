import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import __noop from '@atlaskit/ds-lib/noop';
import PageHeader from '@atlaskit/page-header';

const breadcrumbs = (
	<Breadcrumbs onExpand={__noop}>
		<BreadcrumbsItem text="Projects" key="Projects" />
		<BreadcrumbsItem text="Design System" key="Design System" />
	</Breadcrumbs>
);

const PageHeaderDefaultExample = (): React.JSX.Element => {
	return <PageHeader breadcrumbs={breadcrumbs}>How to use the page header component</PageHeader>;
};

export default PageHeaderDefaultExample;
