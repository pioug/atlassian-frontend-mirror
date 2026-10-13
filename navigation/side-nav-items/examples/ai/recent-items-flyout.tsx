import React from 'react';

import { SideNavBody } from '@atlaskit/navigation-system/layout/side-nav';
import {
	FlyoutBody,
	FlyoutFooter,
	FlyoutHeader,
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { MenuSection, MenuSectionHeading } from '@atlaskit/side-nav-items/menu-section';

export function RecentItemsFlyout(): React.JSX.Element {
	return (
		<SideNavBody>
			<MenuList>
				<FlyoutMenuItem>
					<FlyoutMenuItemTrigger>Recent items</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<FlyoutHeader title="Recent items" closeButtonLabel="Close recent items" />
						<FlyoutBody>
							<MenuSection>
								<MenuSectionHeading>This week</MenuSectionHeading>
								<MenuList>
									<LinkMenuItem href="/projects/kanban" description="Opened yesterday">
										Kanban project
									</LinkMenuItem>
								</MenuList>
							</MenuSection>
						</FlyoutBody>
						<FlyoutFooter>
							<MenuList>
								<LinkMenuItem href="/recent">View all recent items</LinkMenuItem>
							</MenuList>
						</FlyoutFooter>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>
			</MenuList>
		</SideNavBody>
	);
}

export default RecentItemsFlyout;
