/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar';
import Badge from '@atlaskit/badge';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button, { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import { IconTile } from '@atlaskit/icon';
import AddIcon from '@atlaskit/icon/core/add';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AppsIcon from '@atlaskit/icon/core/apps';
import BoardIcon from '@atlaskit/icon/core/board';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import ClockIcon from '@atlaskit/icon/core/clock';
import CrossIcon from '@atlaskit/icon/core/cross';
import GrowDiagonalIcon from '@atlaskit/icon/core/grow-diagonal';
import InboxIcon from '@atlaskit/icon/core/inbox';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import LockUnlockedIcon from '@atlaskit/icon/core/lock-unlocked';
import PremiumIcon from '@atlaskit/icon/core/premium';
import ProjectIcon from '@atlaskit/icon/core/project';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { ConfluenceIcon } from '@atlaskit/logo';
import Lozenge from '@atlaskit/lozenge';
import { MenuList } from '@atlaskit/navigation-system';
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
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuListItem } from '@atlaskit/navigation-system/side-nav-items/menu-list-item';
import { Divider } from '@atlaskit/navigation-system/side-nav-items/menu-section';
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
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import Tag from '@atlaskit/tag/simple-tag';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';
import { MockSearch } from './utils/mock-search';

const panelStyles = cssMap({
	header: {
		paddingInline: token('space.300'),
		paddingBlock: token('space.150'),
		justifyContent: 'space-between',
		border: `0 solid ${token('color.border')}`,
		borderBlockEndWidth: token('border.width'),
		alignItems: 'center',
		position: 'sticky',
		top: token('space.0'),
		backgroundColor: token('elevation.surface'),
		zIndex: 1,
		overflow: 'hidden',
		height: '57px',
	},
	body: {
		paddingInline: token('space.300'),
		paddingBlock: token('space.300'),
		gap: token('space.250'),
	},
	metadataItem: {
		display: 'grid',
		gridTemplateColumns: '100px 1fr auto',
		gap: token('space.100'),
		justifyItems: 'start',
		paddingBlock: token('space.075'),
		alignItems: 'center',
	},
	metadataShowMoreText: {
		gridColumn: 'span 2',
	},
	tabPanel: {
		paddingBlockStart: token('space.250'),
	},
});

const bannerStyles = cssMap({
	root: {
		backgroundColor: token('elevation.surface.sunken'),
	},
});

const contentStyles = cssMap({
	root: {
		alignItems: 'center',
	},
	header: {
		paddingInline: token('space.250'),
		paddingBlock: token('space.150'),
		justifyContent: 'space-between',
		border: `0 solid ${token('color.border')}`,
		borderBlockEndWidth: token('border.width'),
		alignItems: 'center',
		width: '100%',
		height: '57px',
	},
	breadcrumbs: {
		overflow: 'hidden',
		height: '24px',
	},
	body: {
		paddingInline: token('space.500'),
		paddingBlock: token('space.400'),
		maxWidth: '760px',
	},
});

export default function ConfluenceMockExample() {
	return (
		<WithResponsiveViewport>
			<Root testId="root">
				<Banner xcss={bannerStyles.root}> </Banner>
				<TopNav>
					<TopNavStart>
						<SideNavToggleButton
							testId="side-nav-toggle-button"
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
						/>
						<AppSwitcher label="Switch apps" />
						<AppLogo href="" icon={ConfluenceIcon} name="Confluence" label="Home page" />
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
							<FlyoutMenuItem>
								<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" color="currentColor" />}>
									Recent
								</FlyoutMenuItemTrigger>
								<FlyoutMenuItemContent>
									<ButtonMenuItem elemBefore={<BoardIcon label="" color="currentColor" />}>
										YNG board
									</ButtonMenuItem>
									<Divider />
									<ButtonMenuItem elemBefore={<AlignTextLeftIcon label="" color="currentColor" />}>
										View all starred items
									</ButtonMenuItem>
								</FlyoutMenuItemContent>
							</FlyoutMenuItem>
						</MenuList>
					</SideNavContent>
					<PanelSplitter label="Resize side nav" testId="side-nav-panel-splitter" />
				</SideNav>
				<Main id="main-container">
					<Stack xcss={contentStyles.root}>
						<Inline xcss={contentStyles.header} space="space.200">
							<Inline xcss={contentStyles.breadcrumbs}>
								<Breadcrumbs>
									<BreadcrumbsItem text="Design System" />
									<BreadcrumbsItem text="Guides" />
									<BreadcrumbsItem text="Getting started with Atlassian Design System" />
								</Breadcrumbs>
							</Inline>
							<Inline space="space.100">
								<Button iconBefore={LockUnlockedIcon}>Share</Button>
								<IconButton icon={ShowMoreHorizontalIcon} label="" appearance="subtle" />
							</Inline>
						</Inline>
						<Stack xcss={contentStyles.body} space="space.300">
							<Heading as="h1" size="xlarge">
								Getting Started with Atlassian Design System
							</Heading>
							<Stack space="space.150">
								<Text as="p">
									The Atlassian Design System provides a complete set of UI components, patterns,
									and guidelines for creating consistent and beautiful user experiences across
									Atlassian apps.
								</Text>
								<Text as="p">
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi labore corporis
									possimus! Magnam perferendis minus in aliquam facilis enim quaerat. Deleniti
									dolore magni alias soluta? Molestias aliquam optio modi aliquid!
								</Text>
								<Text as="p">
									Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint quos velit veniam
									dolore ad aperiam illo odit quisquam ducimus, autem perferendis. Officiis
									molestias quibusdam inventore voluptatibus id autem labore quia.
								</Text>
							</Stack>
						</Stack>
					</Stack>
				</Main>
				<Panel>
					<Inline xcss={panelStyles.header}>
						<Inline space="space.050" alignBlock="center">
							<ProjectIcon label="" spacing="spacious" color={token('color.icon.subtle')} />
							<Text weight="bold" color="color.text.subtle">
								Projects
							</Text>
						</Inline>
						<Inline space="space.100">
							<Inline space="space.050">
								<IconButton icon={LinkExternalIcon} label="" appearance="subtle" />
								<IconButton icon={GrowDiagonalIcon} label="" appearance="subtle" />
							</Inline>
							<IconButton
								icon={(iconProps) => <CrossIcon {...iconProps} size="small" />}
								label=""
							/>
						</Inline>
					</Inline>
					<Stack xcss={panelStyles.body} space="space.250">
						<Inline space="space.150">
							<IconTile icon={PremiumIcon} label="" appearance="orange" size="32" />
							<Heading size="medium" as="div">
								Automated Meeting Notes MVP with Loom {'<>'} Confluence
							</Heading>
						</Inline>
						<Stack space="space.100">
							<div css={panelStyles.metadataItem}>
								<Text color="color.text.subtle" weight="medium">
									Status
								</Text>
								<Lozenge appearance="success" isBold>
									On track
								</Lozenge>
							</div>
							<div css={panelStyles.metadataItem}>
								<Text color="color.text.subtle" weight="medium">
									Progress
								</Text>
								<div>
									<Text color="color.text.subtle">
										269/500 <Text color="color.text.subtlest">(60%)</Text>
									</Text>
								</div>
							</div>
							<div css={panelStyles.metadataItem}>
								<Text color="color.text.subtle" weight="medium">
									Owner
								</Text>
								<Inline alignBlock="center" space="space.050">
									<Avatar size="small" />
									<Text>Someone</Text>
								</Inline>
							</div>
							<div css={panelStyles.metadataItem}>
								<Text color="color.text.subtle" weight="medium">
									Topics
								</Text>
								<Inline shouldWrap>
									<Tag text="dashboard" color="blue" />
									<Tag text="all-teams" color="orange" />
								</Inline>
								<IconButton
									icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
									label=""
									spacing="compact"
								/>
							</div>
							<Inline xcss={panelStyles.metadataItem}>
								<div css={panelStyles.metadataShowMoreText}>
									<Text color="color.text.subtle" weight="medium">
										Show 5 more fields
									</Text>
								</div>
								<IconButton
									icon={(iconProps) => <ChevronRightIcon {...iconProps} size="small" />}
									label=""
									spacing="compact"
								/>
							</Inline>
						</Stack>
						<Tabs id="panel-tabs">
							<TabList>
								<Tab>About</Tab>
								<Tab>Updates</Tab>
								<Tab>More</Tab>
							</TabList>
							<TabPanel>
								<Stack xcss={panelStyles.tabPanel} space="space.250">
									<Stack space="space.100">
										<Text weight="bold">What are we doing?</Text>
										<Text>
											Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
											asperiores omnis doloribus dolorem aperiam consectetur, ipsa corrupti
											voluptatem praesentium. Perferendis, atque velit voluptatum totam voluptatibus
											saepe impedit provident minima vel.
										</Text>
										<Text>
											Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque qui
											provident officiis, veritatis voluptatem et sint eos temporibus distinctio
											deleniti corrupti vel aliquam at quaerat ipsam reprehenderit recusandae
											accusantium esse.
										</Text>
									</Stack>
									<Stack space="space.100">
										<Text weight="bold">Why are we doing it?</Text>
										<Text>
											Lorem, ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi sunt
											laboriosam beatae possimus, velit magnam officiis dicta enim. Maxime tenetur
											dicta iste tempore expedita ad cum aliquid eos reiciendis!
										</Text>
										<Text>
											Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia tempore quasi
											magnam recusandae ab eos numquam consequatur dicta error in fuga minima, nemo
											beatae sapiente voluptatem reprehenderit, cum nesciunt ratione!
										</Text>
									</Stack>
								</Stack>
							</TabPanel>
						</Tabs>
					</Stack>
					<PanelSplitter label="Resize panel" />
				</Panel>
			</Root>
		</WithResponsiveViewport>
	);
}
