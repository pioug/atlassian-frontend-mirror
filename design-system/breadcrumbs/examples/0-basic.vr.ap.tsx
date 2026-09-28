import React, { useCallback, useState } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { Box } from '@atlaskit/primitives/compiled/box';

export default function BreadcrumbsExpand(): React.JSX.Element {
	const [isExpanded, setIsExpanded] = useState(false);

	const onExpand = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		setIsExpanded(true);
	}, []);

	return (
		<Breadcrumbs isExpanded={isExpanded} onExpand={onExpand} testId="MyBreadcrumbsTestId">
			<BreadcrumbsItem href="/pages" text="Pages" testId="first-item" />
			<BreadcrumbsItem href="/pages/home" text="Home" />
			<BreadcrumbsItem
				href="/item"
				elemBefore={<AtlassianIcon label="" size="small" />}
				text="Icon Before"
				testId="icon-before-item"
			/>
			<BreadcrumbsItem
				href="/item"
				iconAfter={<AtlassianIcon label="" size="small" />}
				text="Icon After"
			/>
			<BreadcrumbsCurrentItem href="/current-page" text="Current page" testId="current-item" />
		</Breadcrumbs>
	);
}

export function BreadcrumbsFocusRing(): React.JSX.Element {
	return (
		<Box padding="space.100">
			<BreadcrumbsExpand />
		</Box>
	);
}
