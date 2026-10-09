import React from 'react';

import Breadcrumbs from '@atlaskit/breadcrumbs/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import { BreadcrumbsItem } from '@atlaskit/breadcrumbs/breadcrumbs-item';

const BreadcrumbsItemTextExample = (): React.JSX.Element => {
	return (
		<Breadcrumbs>
			<BreadcrumbsItem text="Atlassian" />
			<BreadcrumbsCurrentItem href="/design-system" text="Design System" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsItemTextExample;
