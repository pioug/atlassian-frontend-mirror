import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';

const BreadcrumbsRefreshSizeSmallExample = (): React.JSX.Element => {
	return (
		<Breadcrumbs size="small">
			<BreadcrumbsItem href="/components" text="Components" />
			<BreadcrumbsItem href="/components/breadcrumbs" text="Breadcrumbs" />
			<BreadcrumbsCurrentItem href="/components/breadcrumbs/examples" text="Examples" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsRefreshSizeSmallExample;
