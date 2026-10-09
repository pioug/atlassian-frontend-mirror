import React from 'react';

import Breadcrumbs from '@atlaskit/breadcrumbs/breadcrumbs';
import { BreadcrumbsItem } from '@atlaskit/breadcrumbs/breadcrumbs-item';

const BreadcrumbsRefreshDefaultExample = (): React.JSX.Element => {
	return (
		<Breadcrumbs>
			<BreadcrumbsItem href="/components" text="Components" />
			<BreadcrumbsItem href="/components/breadcrumbs" text="Breadcrumbs" />
			<BreadcrumbsItem href="/components/breadcrumbs/examples" text="Examples" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsRefreshDefaultExample;
