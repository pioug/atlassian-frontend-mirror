import React from 'react';

import Breadcrumbs from '@atlaskit/breadcrumbs/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import { BreadcrumbsItem } from '@atlaskit/breadcrumbs/breadcrumbs-item';

const BreadcrumbsRefreshCurrentItemExample = (): React.JSX.Element => {
	return (
		<Breadcrumbs>
			<BreadcrumbsItem href="/components" text="Components" />
			<BreadcrumbsItem href="/components/breadcrumbs" text="Breadcrumbs" />
			<BreadcrumbsCurrentItem href="/components/breadcrumbs/examples" text="Examples" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsRefreshCurrentItemExample;
