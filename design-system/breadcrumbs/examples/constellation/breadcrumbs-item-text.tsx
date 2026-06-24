import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';

const BreadcrumbsItemTextExample = (): React.JSX.Element => {
	return (
		<Breadcrumbs>
			<BreadcrumbsItem text="Atlassian" />
			<BreadcrumbsCurrentItem href="/design-system" text="Design System" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsItemTextExample;
