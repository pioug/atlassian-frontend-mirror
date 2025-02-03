import React, { useState } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';

const BreadcrumbsExpandable = ({ defaultIsExpanded = false }: { defaultIsExpanded?: boolean }) => {
	const [isExpanded, setExpanse] = useState(defaultIsExpanded);

	function expand(e: React.MouseEvent) {
		e.preventDefault();
		setExpanse(!isExpanded);
	}

	return (
		<Breadcrumbs
			maxItems={2}
			isExpanded={isExpanded}
			onExpand={(e) => expand(e)}
			testId="MyBreadcrumbsTestId"
		>
			<BreadcrumbsItem href="/pages" text="Pages" key="Pages" />
			<BreadcrumbsItem href="/hidden" text="hidden bread crumb" key="hidden bread crumb" />
			<BreadcrumbsItem href="/pages/home" text="Home" key="Home" />
		</Breadcrumbs>
	);
};

export const BreadcrumbsExpandableDefaultIsExpanded = () => (
	<BreadcrumbsExpandable defaultIsExpanded />
);

export default BreadcrumbsExpandable;
