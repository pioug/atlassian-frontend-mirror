import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';

const BreadcrumbsExpandedExample = () => {
	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				maxWidth: '500px',
			}}
		>
			<Breadcrumbs maxItems={5}>
				<BreadcrumbsItem href="/item" text="Item" />
				<BreadcrumbsItem href="/item" text="Another item" />
				<BreadcrumbsItem href="/item" text="A third item" />
				<BreadcrumbsItem href="/item" text="A fourth item with a very long name" />
				<BreadcrumbsItem href="/item" text="Item 5" />
				<BreadcrumbsItem href="/item" text="A sixth item" />
			</Breadcrumbs>
		</div>
	);
};

export default BreadcrumbsExpandedExample;
