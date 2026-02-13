/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import AppsIcon from '@atlaskit/icon/core/apps';
import InboxIcon from '@atlaskit/icon/core/inbox';
import ProjectIcon from '@atlaskit/icon/core/project';
import { ConfluenceIcon } from '@atlaskit/logo';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavContent,
	SideNavToggleButton,
} from '@atlaskit/navigation-system/layout/side-nav';
import { useSkipLink } from '@atlaskit/navigation-system/layout/skip-links';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
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
import { Stack } from '@atlaskit/primitives/compiled';
import { LinkMenuItem } from '@atlaskit/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';

const headingStyles = cssMap({
	root: {
		paddingInline: token('space.300'),
		paddingBlockStart: token('space.300'),
	},
});

function ComponentWithCustomSkipLink({
	listIndex,
	id,
	skipLinkLabel,
}: {
	listIndex: number;
	id: string;
	skipLinkLabel: string;
}) {
	useSkipLink(id, skipLinkLabel, listIndex);
	return (
		<div id={id}>
			{skipLinkLabel}, index {listIndex}
		</div>
	);
}

export function CustomSkipLinksExample(): JSX.Element {
	return (
		<WithResponsiveViewport>
			<Root>
				<TopNav>
					<TopNavStart
						sideNavToggleButton={
							<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
						}
					>
						<AppLogo href="" icon={ConfluenceIcon} label="Home page" name="Confluence" />
						<AppSwitcher label="Switch apps" />
					</TopNavStart>

					<TopNavMiddle>
						<Search label="Search" />
						<CreateButton>Create</CreateButton>
					</TopNavMiddle>

					<TopNavEnd>
						<Help label="Help" />
						<Notifications
							label="Notifications"
							badge={() => (
								<Badge max={9} appearance="important">
									{99999}
								</Badge>
							)}
						/>
						<Settings label="Settings" />
						<DropdownMenu
							shouldRenderToParent
							trigger={({ triggerRef: ref, ...props }) => (
								<Profile ref={ref} label="Profile" {...props} />
							)}
						>
							<DropdownItemGroup>
								<DropdownItem>Account</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
					</TopNavEnd>
				</TopNav>

				<SideNav>
					<SideNavContent>
						<MenuList>
							<LinkMenuItem href="#" elemBefore={<InboxIcon label="" color="currentColor" />}>
								Your work
							</LinkMenuItem>
							<LinkMenuItem href="#" elemBefore={<AppsIcon label="" color="currentColor" />}>
								Apps
							</LinkMenuItem>
							<LinkMenuItem href="#" elemBefore={<ProjectIcon label="" color="currentColor" />}>
								Projects
							</LinkMenuItem>
						</MenuList>
					</SideNavContent>
					<PanelSplitter label="Resize side nav" />
				</SideNav>

				<Main id="main-container">
					<Stack space="space.100" xcss={headingStyles.root}>
						<Heading size="large">Settings</Heading>

						<ComponentWithCustomSkipLink
							listIndex={0}
							id="custom-skip-link-1"
							skipLinkLabel="Custom skip link 1"
						/>
						<ComponentWithCustomSkipLink
							listIndex={1}
							id="custom-skip-link-2"
							skipLinkLabel="Custom skip link 2"
						/>
						<ComponentWithCustomSkipLink
							listIndex={1}
							id="custom-skip-link-3"
							skipLinkLabel="Custom skip link 3"
						/>
						<ComponentWithCustomSkipLink
							listIndex={7}
							id="custom-skip-link-4"
							skipLinkLabel="Custom skip link 4"
						/>

						<ComponentWithCustomSkipLink
							listIndex={10}
							id="main-content"
							skipLinkLabel="Main content duplicate"
						/>
					</Stack>
				</Main>
			</Root>
		</WithResponsiveViewport>
	);
}

// Default export is required to work with the Codesandbox example template
export default CustomSkipLinksExample;
