import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';

const BreadcrumbsBeforeAfterCollapseExample = (): React.JSX.Element => {
	return (
		<Box>
			<Breadcrumbs itemsBeforeCollapse={3} itemsAfterCollapse={2}>
				<BreadcrumbsItem href="/item" text="Item 1" />
				<BreadcrumbsItem href="/item" text="Item 2" />
				<BreadcrumbsItem href="/item" text="Item 3" />
				<BreadcrumbsItem href="/item" text="Item 4" />
				<BreadcrumbsItem href="/item" text="Item 5" />
				<BreadcrumbsItem href="/item" text="Item 6" />
				<BreadcrumbsItem href="/item" text="Item 7" />
				<BreadcrumbsItem href="/item" text="Item 8" />
				<BreadcrumbsItem href="/item" text="Item 9" />
				<BreadcrumbsItem href="/item" text="Item 10" />
			</Breadcrumbs>
		</Box>
	);
};

export default BreadcrumbsBeforeAfterCollapseExample;
