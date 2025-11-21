import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';

const BreadcrumbsItemTextExample = (): React.JSX.Element => {
	return (
		<Breadcrumbs>
			<BreadcrumbsItem text="Atlassian" />
			<BreadcrumbsItem text="Design System" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsItemTextExample;
