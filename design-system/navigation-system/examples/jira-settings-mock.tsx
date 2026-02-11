/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import Button, { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import ArrowLeftIcon from '@atlaskit/icon/core/arrow-left';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ScreenIcon from '@atlaskit/icon/core/screen';
import { JiraIcon } from '@atlaskit/logo';
import { MenuList, SideNavHeader } from '@atlaskit/navigation-system';
import { Banner } from '@atlaskit/navigation-system/layout/banner';
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
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';
import { MockSearch } from './utils/mock-search';

const sideNavStyles = cssMap({
	header: {
		paddingInline: token('space.050'),
	},
});

const bannerStyles = cssMap({
	root: {
		backgroundColor: token('elevation.surface.sunken'),
	},
});

export default function JiraSettingMockExample(): JSX.Element {
	return (
		<WithResponsiveViewport>
			<Root testId="root">
				<Banner xcss={bannerStyles.root}> </Banner>
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
					<SideNavHeader>
						<Stack xcss={sideNavStyles.header} space="space.200">
							<Inline space="space.100" alignBlock="center">
								<IconButton
									icon={ArrowLeftIcon}
									label="Go back"
									spacing="compact"
									appearance="subtle"
								/>
								<Heading size="small">Jira admin settings</Heading>
							</Inline>
							<Stack space="space.100">
								<Text size="small" weight="bold" color="color.text.subtle">
									Switch settings
								</Text>
								<DropdownMenu
									shouldRenderToParent
									shouldFitContainer
									trigger={({ triggerRef, ...triggerProps }) => (
										<Button
											ref={triggerRef}
											{...triggerProps}
											shouldFitContainer
											iconBefore={ScreenIcon}
											iconAfter={ChevronDownIcon}
										>
											<Inline>System</Inline>
										</Button>
									)}
								>
									<DropdownItem elemBefore={<ScreenIcon label="" />}>System</DropdownItem>
								</DropdownMenu>
							</Stack>
						</Stack>
					</SideNavHeader>
					<SideNavContent testId="side-nav-content">
						<MenuList>
							<LinkMenuItem href="#">General configuration</LinkMenuItem>
							{Array.from({ length: 15 }, (_, index) => (
								<LinkMenuItem href="#" key={index}>
									Item {index + 2}
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
