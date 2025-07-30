/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { JiraIcon } from '@atlaskit/logo';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNav, SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import { MenuListItem } from '@atlaskit/navigation-system/side-nav-items/menu-list-item';
import {
	AppLogo,
	AppSwitcher,
	CreateButton,
	Help,
	Notifications,
	Profile,
	Search,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';

import { WithResponsiveViewport } from '../../utils/example-utils';

import { Sidebar } from './sidebar';

export function App() {
	return (
		<WithResponsiveViewport>
			<div>
				<Root>
					<TopNav>
						<TopNavStart>
							<SideNavToggleButton
								collapseLabel="Collapse sidebar"
								expandLabel="Expand sidebar"
								defaultCollapsed={false}
							/>
							<AppSwitcher label="Switch apps" />
							<AppLogo href="" icon={JiraIcon} name="Jira" label="Home page" />
						</TopNavStart>
						<TopNavMiddle>
							<Search label="Search" />
							<CreateButton>Create</CreateButton>
						</TopNavMiddle>
						<TopNavEnd>
							<Help label="Help" />
							<Notifications
								badge={() => (
									<Badge max={9} appearance="important">
										{99999}
									</Badge>
								)}
								label="Notifications"
							/>
							<Settings label="Settings" />
							<MenuListItem>
								<DropdownMenu
									shouldRenderToParent
									trigger={({ triggerRef: ref, ...props }) => (
										<Profile ref={ref} label="Profile" {...props} isListItem={false} />
									)}
								>
									<DropdownItemGroup>
										<DropdownItem>Account</DropdownItem>
									</DropdownItemGroup>
								</DropdownMenu>
							</MenuListItem>
						</TopNavEnd>
					</TopNav>
					<SideNav defaultCollapsed={false}>
						<Sidebar />
						<PanelSplitter label="Resize side nav" />
					</SideNav>
				</Root>
			</div>
		</WithResponsiveViewport>
	);
}
