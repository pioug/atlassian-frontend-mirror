import React, { useCallback, useState } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { AtlassianIcon } from '@atlaskit/logo';

export default function BreadcrumbsExpand() {
	const [isExpanded, setIsExpanded] = useState(false);

	const onExpand = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		setIsExpanded(true);
	}, []);

	return (
		<Breadcrumbs isExpanded={isExpanded} onExpand={onExpand} testId="MyBreadcrumbsTestId">
			<BreadcrumbsItem href="/pages" text="Pages" />
			<BreadcrumbsItem href="/pages/home" text="Home" />
			<BreadcrumbsItem
				href="/item"
				iconBefore={<AtlassianIcon label="" size="small" />}
				text="Icon Before"
			/>
			<BreadcrumbsItem
				href="/item"
				iconAfter={<AtlassianIcon label="" size="small" />}
				text="Icon After"
			/>
		</Breadcrumbs>
	);
}
