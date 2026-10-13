import React from 'react';

import { SideNavBody } from '@atlaskit/navigation-system/layout/side-nav';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { MenuListItem } from '@atlaskit/side-nav-items/menu-list-item';
import {
	SkeletonMenuItem,
	SkeletonMenuItemNext,
	SkeletonMenuSectionHeading,
} from '@atlaskit/side-nav-items/skeleton';

/** Keep the loading announcement on the region; placeholders themselves are visual only. */
export function NavigationLoading(): React.JSX.Element {
	return (
		<SideNavBody>
			<div aria-busy="true" aria-label="Loading projects">
				<p role="status">Loading projects</p>
				<MenuList>
					<MenuListItem>
						<SkeletonMenuSectionHeading />
					</MenuListItem>
					<MenuListItem>
						<SkeletonMenuItem hasElemBefore hasDescription />
					</MenuListItem>
					<MenuListItem>
						<SkeletonMenuItemNext />
					</MenuListItem>
				</MenuList>
			</div>
		</SideNavBody>
	);
}

export default NavigationLoading;
