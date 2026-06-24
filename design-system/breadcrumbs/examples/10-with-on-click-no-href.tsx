import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';

export default (): React.JSX.Element => (
	// with onClick handler and no href
	<div>
		<Breadcrumbs>
			<BreadcrumbsItem onClick={() => console.log('Item1 click')} text="Item1 with onClick" />
			<BreadcrumbsItem onClick={() => console.log('Item2 Click')} text="Item2 with onClick" />
			<BreadcrumbsCurrentItem href="/current-page" text="Current page" />
		</Breadcrumbs>
	</div>
);
