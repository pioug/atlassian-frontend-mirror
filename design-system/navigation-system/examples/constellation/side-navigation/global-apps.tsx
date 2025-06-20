import React from 'react';

import AppsIcon from '@atlaskit/icon/core/apps';
import InboxIcon from '@atlaskit/icon/core/migration/inbox--tray';
import LinkExternalIcon from '@atlaskit/icon/core/migration/link-external--shortcut';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/migration/show-more-horizontal--more';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import { ConfluenceIcon, JiraIcon } from '@atlaskit/logo';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { TopLevelSpacer } from '@atlaskit/navigation-system/side-nav-items/top-level-spacer';

import { GlobalAppIconTile } from './common/global-app-icon-tile';
import { MockSideNav } from './common/mock-side-nav';

export const GlobalAppsExample = () => (
	<MockSideNav>
		<SideNavContent>
			<MenuList>
				<LinkMenuItem href="#" elemBefore={<InboxIcon label="" />}>
					For you
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={<AppsIcon LEGACY_fallbackIcon={AppSwitcherIcon} label="" />}
				>
					Apps
				</LinkMenuItem>

				<TopLevelSpacer />

				<LinkMenuItem
					href="#"
					elemBefore={<GlobalAppIconTile logo={JiraIcon} />}
					elemAfter={
						<LinkExternalIcon label="" spacing="spacious" LEGACY_size="small" size="small" />
					}
					description="My site"
				>
					Jira
				</LinkMenuItem>
				<FlyoutMenuItem>
					<FlyoutMenuItemTrigger elemBefore={<GlobalAppIconTile logo={ConfluenceIcon} />}>
						Confluence
					</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<MenuList>
							<LinkMenuItem
								href="#"
								elemBefore={<GlobalAppIconTile logo={ConfluenceIcon} />}
								elemAfter={
									<LinkExternalIcon label="" spacing="spacious" LEGACY_size="small" size="small" />
								}
								description="Site A"
							>
								Confluence
							</LinkMenuItem>
							<LinkMenuItem
								href="#"
								elemBefore={<GlobalAppIconTile logo={ConfluenceIcon} />}
								elemAfter={
									<LinkExternalIcon label="" spacing="spacious" LEGACY_size="small" size="small" />
								}
								description="Site B"
							>
								Confluence
							</LinkMenuItem>
							<LinkMenuItem
								href="#"
								elemBefore={<GlobalAppIconTile logo={ConfluenceIcon} />}
								elemAfter={
									<LinkExternalIcon label="" spacing="spacious" LEGACY_size="small" size="small" />
								}
								description="Site C"
							>
								Confluence
							</LinkMenuItem>
						</MenuList>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>

				<TopLevelSpacer />

				<ButtonMenuItem elemBefore={<ShowMoreHorizontalIcon label="" />}>More</ButtonMenuItem>
			</MenuList>
		</SideNavContent>
	</MockSideNav>
);

export default GlobalAppsExample;
