import React from 'react';

import HomeIcon from '@atlaskit/icon/core/home';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import {
	ExpandableMenuItem,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';

import { MockSideNav } from './common/mock-side-nav';

const exampleHref = '#example-href';

export function TruncationExample() {
	return (
		<MockSideNav>
			<SideNavContent>
				<MenuList>
					<LinkMenuItem
						href={exampleHref}
						elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
					>
						Link menu item (very long label to trigger truncation)
					</LinkMenuItem>
					<LinkMenuItem
						href={exampleHref}
						elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
						description="This is a very long description to trigger truncation"
					>
						Link menu item (very long label to trigger truncation)
					</LinkMenuItem>

					<ExpandableMenuItem>
						<ExpandableMenuItemTrigger>
							Exp default menu item (very long label to trigger truncation)
						</ExpandableMenuItemTrigger>
					</ExpandableMenuItem>

					<FlyoutMenuItem>
						<FlyoutMenuItemTrigger
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
						>
							Flyout menu item (very long label to trigger truncation)
						</FlyoutMenuItemTrigger>
					</FlyoutMenuItem>
				</MenuList>
			</SideNavContent>
		</MockSideNav>
	);
}

export default TruncationExample;
