/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import AKBanner from '@atlaskit/banner';
import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import AppsIcon from '@atlaskit/icon/core/apps';
import InboxIcon from '@atlaskit/icon/core/inbox';
import ProjectIcon from '@atlaskit/icon/core/project';
import { ConfluenceIcon } from '@atlaskit/logo';
import { Aside } from '@atlaskit/navigation-system/layout/aside';
import { Banner } from '@atlaskit/navigation-system/layout/banner';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Panel } from '@atlaskit/navigation-system/layout/panel';
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
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
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
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';
import { LongPlaceholderContent } from './utils/long-placeholder-content';

const bannerStyles = cssMap({
	root: {
		backgroundColor: token('elevation.surface.sunken'),
	},
});

const asideStyles = cssMap({
	root: {
		backgroundColor: token('elevation.surface.sunken'),
	},
	content: {
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
		borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
		height: '100%',
	},
});

const panelStyles = cssMap({
	content: {
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
	},
});

const headingStyles = cssMap({
	root: {
		paddingInline: token('space.300'),
		paddingBlockStart: token('space.300'),
	},
});

// Example slot widths
const defaultSlotWidths = {
	sideNav: 350,
	panel: 350,
	aside: 400,
};

export function InteractiveLayoutExample() {
	const [isBannerVisible, setIsBannerVisible] = useState(false);
	const [isAsideVisible, setIsAsideVisible] = useState(false);
	const [isPanelVisible, setIsPanelVisible] = useState(false);
	const [isSideNavDefaultCollapsed, setIsSideNavDefaultCollapsed] = useState(false);

	// "Persisted" slot widths
	const [persistedSideNavWidth, setPersistedSideNavWidth] = useState(defaultSlotWidths.sideNav);
	const [persistedPanelWidth, setPersistedPanelWidth] = useState(defaultSlotWidths.panel);
	const [persistedAsideWidth, setPersistedAsideWidth] = useState(defaultSlotWidths.aside);

	const [isMainLongPlaceholderContentVisible, setIsMainLongPlaceholderContentVisible] =
		useState(false);

	const [isAsideLongPlaceholderContentVisible, setIsAsideLongPlaceholderContentVisible] =
		useState(false);

	const [isPanelLongPlaceholderContentVisible, setIsPanelLongPlaceholderContentVisible] =
		useState(false);

	return (
		<WithResponsiveViewport>
			<Root>
				{isBannerVisible && (
					<Banner
						xcss={bannerStyles.root}
						// Setting slot height to match the height of the Atlaskit Banner component.
						height={48}
					>
						<AKBanner appearance="announcement">Great news! A new navigation system.</AKBanner>
					</Banner>
				)}

				<TopNav>
					<TopNavStart>
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
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

				<SideNav
					defaultCollapsed={isSideNavDefaultCollapsed}
					onExpand={() => setIsSideNavDefaultCollapsed(false)}
					onCollapse={() => setIsSideNavDefaultCollapsed(true)}
					defaultWidth={persistedSideNavWidth}
				>
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
					<PanelSplitter
						label="Resize side nav"
						onResizeEnd={({ finalWidth }) => setPersistedSideNavWidth(finalWidth)}
					/>
				</SideNav>

				<Main id="main-container">
					<Stack space="space.100" xcss={headingStyles.root}>
						<Heading size="large">Interactive layout example</Heading>
						<Text>Resize your browser to see how it responds to different screen sizes.</Text>

						<Text>
							Play around with these toggles to see how the layout areas respond with different
							combinations:
						</Text>
						<Inline space="space.100" shouldWrap>
							<Button
								isSelected={isBannerVisible}
								onClick={() => setIsBannerVisible((prev) => !prev)}
							>
								Toggle banner
							</Button>
							<Button
								isSelected={isAsideVisible}
								onClick={() => setIsAsideVisible((prev) => !prev)}
							>
								Toggle aside
							</Button>
							<Button
								isSelected={isPanelVisible}
								onClick={() => setIsPanelVisible((prev) => !prev)}
							>
								Toggle panel
							</Button>
							<Button
								isSelected={isMainLongPlaceholderContentVisible}
								onClick={() => setIsMainLongPlaceholderContentVisible((current) => !current)}
							>
								Toggle long content
							</Button>
						</Inline>
						{isMainLongPlaceholderContentVisible && <LongPlaceholderContent />}
					</Stack>
				</Main>

				{isAsideVisible && (
					<Aside xcss={asideStyles.root} defaultWidth={persistedAsideWidth}>
						<Stack space="space.100" xcss={asideStyles.content}>
							<Heading size="medium">Aside layout area</Heading>
							<Text>This element is rendered in the aside layout area.</Text>
							<Text>Aside moves below the main layout area on small viewports.</Text>

							{/* Wrapping div added to prevent Button from taking full width */}
							<div>
								<Button
									isSelected={isAsideLongPlaceholderContentVisible}
									onClick={() => setIsAsideLongPlaceholderContentVisible((current) => !current)}
								>
									Toggle long content
								</Button>
							</div>
							{isAsideLongPlaceholderContentVisible && <LongPlaceholderContent />}
						</Stack>
						<PanelSplitter
							label="Resize aside"
							onResizeEnd={({ finalWidth }) => setPersistedAsideWidth(finalWidth)}
						/>
					</Aside>
				)}

				{isPanelVisible && (
					<Panel defaultWidth={persistedPanelWidth}>
						<Stack space="space.100" xcss={panelStyles.content}>
							<Heading size="medium">Panel layout area</Heading>
							<Text>This element is rendered in the panel layout area.</Text>
							<Text>Panel becomes an overlay on small-medium viewports.</Text>

							{/* Wrapping div added to prevent Button from taking full width */}
							<div>
								<Button
									isSelected={isPanelLongPlaceholderContentVisible}
									onClick={() => setIsPanelLongPlaceholderContentVisible((current) => !current)}
								>
									Toggle long content
								</Button>
							</div>

							{isPanelLongPlaceholderContentVisible && <LongPlaceholderContent />}
						</Stack>
						<PanelSplitter
							label="Resize panel"
							onResizeEnd={({ finalWidth }) => setPersistedPanelWidth(finalWidth)}
						/>
					</Panel>
				)}
			</Root>
		</WithResponsiveViewport>
	);
}

// Default export is required to work with the Codesandbox example template
export default InteractiveLayoutExample;
