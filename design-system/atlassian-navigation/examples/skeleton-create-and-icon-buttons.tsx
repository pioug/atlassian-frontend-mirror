import React from 'react';

import { AtlassianNavigation } from '@atlaskit/atlassian-navigation';
import { SkeletonPrimaryButton } from '@atlaskit/atlassian-navigation/skeleton';
import { SkeletonSwitcherButton } from '@atlaskit/atlassian-navigation/skeleton-switcher-button';

const skeletonPrimaryItems = [
	<SkeletonPrimaryButton>Home</SkeletonPrimaryButton>,
	<SkeletonPrimaryButton isDropdownButton text="Projects" />,
	<SkeletonPrimaryButton isDropdownButton isHighlighted text="Filters &amp; work items" />,
	<SkeletonPrimaryButton isDropdownButton text="Dashboards" />,
	<SkeletonPrimaryButton isDropdownButton text="Apps" />,
];

const AtlassianNavigationExample = (): React.JSX.Element => (
	<AtlassianNavigation
		renderProductHome={() => null}
		label="site"
		moreLabel="More"
		primaryItems={skeletonPrimaryItems}
		renderAppSwitcher={() => <SkeletonSwitcherButton label="switcher button" />}
	/>
);

export default AtlassianNavigationExample;
