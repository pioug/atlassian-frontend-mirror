import React from 'react';

import Breadcrumbs from '@atlaskit/breadcrumbs/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import { BreadcrumbsItem } from '@atlaskit/breadcrumbs/breadcrumbs-item';

export default (): React.JSX.Element => (
	// with many items, and a maximum to display set
	<div>
		<p>Should automatically collapse if there are more than 5 items</p>
		<div>
			<Breadcrumbs maxItems={5} testId="MyBreadcrumbsTestId">
				<BreadcrumbsItem href="/item" text="Item" />
				<BreadcrumbsItem
					href="/packages/design-system/breadcrumbs"
					text="The item with testId"
					testId="myBreadcrumbsItemTestId"
				/>
				<BreadcrumbsItem href="/item" text="A third item" />
				<BreadcrumbsItem href="/item" text="A fourth item with a very long name" />
				<BreadcrumbsItem href="/item" text="Item 5" />
				<BreadcrumbsCurrentItem href="/item" text="A sixth item" />
			</Breadcrumbs>
		</div>
	</div>
);
