/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { JiraIcon } from '@atlaskit/logo';
import { MenuList } from '@atlaskit/navigation-system';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavContent,
	SideNavToggleButton,
} from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuListItem } from '@atlaskit/navigation-system/side-nav-items/menu-list-item';
import {
	AppLogo,
	AppSwitcher,
	CreateButton,
	Help,
	Notifications,
	Profile,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';

import { WithResponsiveViewport } from './utils/example-utils';
import { MockSearch } from './utils/mock-search';

export default function JiraMockExample(): JSX.Element {
	return (
		<WithResponsiveViewport>
			<Root testId="root">
				<TopNav>
					<TopNavStart
						sideNavToggleButton={
							<SideNavToggleButton
								testId="side-nav-toggle-button"
								collapseLabel="Collapse sidebar"
								expandLabel="Expand sidebar"
							/>
						}
					>
						<AppSwitcher label="Switch apps" />
						<AppLogo href="" icon={JiraIcon} name="Jira" label="Home page" />
					</TopNavStart>
					<TopNavMiddle>
						<MockSearch />
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
									<Profile ref={ref} label="Profile" isListItem={false} {...props} />
								)}
							>
								<DropdownItemGroup>
									<DropdownItem>Account</DropdownItem>
								</DropdownItemGroup>
							</DropdownMenu>
						</MenuListItem>
					</TopNavEnd>
				</TopNav>
				<SideNav>
					<SideNavContent testId="side-nav-content">
						<MenuList>
							{Array.from({ length: 30 }, (_, index) => (
								<LinkMenuItem href="#" key={index}>
									Item {index + 1}
								</LinkMenuItem>
							))}
						</MenuList>
					</SideNavContent>
					<PanelSplitter label="Resize side nav" testId="side-nav-panel-splitter" />
				</SideNav>
				<Main id="main-container">Hello world</Main>
			</Root>
		</WithResponsiveViewport>
	);
}
