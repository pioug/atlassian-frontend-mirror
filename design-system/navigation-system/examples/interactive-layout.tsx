/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import AKBanner from '@atlaskit/banner';
import Button, { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { FlagsProvider, useFlags } from '@atlaskit/flag';
import Heading from '@atlaskit/heading';
import AddIcon from '@atlaskit/icon/core/add';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AppsIcon from '@atlaskit/icon/core/apps';
import BoardIcon from '@atlaskit/icon/core/board';
import ClockIcon from '@atlaskit/icon/core/clock';
import InboxIcon from '@atlaskit/icon/core/inbox';
import ProjectIcon from '@atlaskit/icon/core/project';
import StatusInformationIcon from '@atlaskit/icon/core/status-information';
import { ConfluenceIcon } from '@atlaskit/logo';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Aside } from '@atlaskit/navigation-system/layout/aside';
import { Banner } from '@atlaskit/navigation-system/layout/banner';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Panel } from '@atlaskit/navigation-system/layout/panel';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavContent,
	SideNavFooter,
	SideNavHeader,
	SideNavPanelSplitter,
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
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { Divider } from '@atlaskit/navigation-system/side-nav-items/menu-section';
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
import Popup from '@atlaskit/popup';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { CardGrid } from './utils/card-grid';
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

const appSwitcherStyles = cssMap({
	root: {
		width: '400px',
		height: '500px',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});

function MockAppSwitcher(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => {
				setIsOpen(false);
			}}
			content={() => <div css={appSwitcherStyles.root}>Mock app switcher</div>}
			placement="bottom-start"
			shouldRenderToParent
			trigger={(triggerProps) => (
				<AppSwitcher
					{...triggerProps}
					onClick={() => {
						setIsOpen((prev) => !prev);
					}}
					label="Switch apps"
					isSelected={isOpen}
				/>
			)}
		/>
	);
}

function Example() {
	const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
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

	const [isCardGridVisible, setIsCardGridVisible] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { showFlag } = useFlags();
	const flagCount = useRef(1);

	const addFlag = useCallback(() => {
		const id = flagCount.current++;
		showFlag({
			description: 'Added from the context.',
			icon: <StatusInformationIcon label="" color={token('color.icon.information')} />,
			id: id,
			title: `${id}: Whoa a new flag!`,
		});
	}, [showFlag]);

	return (
		<div dir={direction}>
			<Root defaultSideNavCollapsed={isSideNavDefaultCollapsed} isSideNavShortcutEnabled>
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
					<TopNavStart
						sideNavToggleButton={
							<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
						}
					>
						<MockAppSwitcher />
						<AppLogo href="" icon={ConfluenceIcon} label="Home page" name="Confluence" />
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
					<SideNavHeader>
						<Heading size="medium">Sidebar header</Heading>
					</SideNavHeader>
					<SideNavContent>
						<MenuList>
							<LinkMenuItem href="#" elemBefore={<InboxIcon label="" />}>
								Your work
							</LinkMenuItem>
							<LinkMenuItem href="#" elemBefore={<AppsIcon label="" />}>
								Apps
							</LinkMenuItem>
							<LinkMenuItem
								href="#"
								elemBefore={<ProjectIcon label="" />}
								actions={
									<DropdownMenu
										shouldRenderToParent
										trigger={({ triggerRef, ...props }) => (
											<IconButton
												ref={triggerRef}
												{...props}
												spacing="compact"
												appearance="subtle"
												label="Add"
												icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
											/>
										)}
									>
										<DropdownItemGroup>
											<DropdownItem>Create</DropdownItem>
											<DropdownItem>Import</DropdownItem>
										</DropdownItemGroup>
									</DropdownMenu>
								}
							>
								Projects
							</LinkMenuItem>

							<FlyoutMenuItem>
								<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" />}>
									Recent
								</FlyoutMenuItemTrigger>
								<FlyoutMenuItemContent>
									<ButtonMenuItem elemBefore={<BoardIcon label="" />}>YNG board</ButtonMenuItem>
									<Divider />
									<ButtonMenuItem elemBefore={<AlignTextLeftIcon label="" />}>
										View all starred items
									</ButtonMenuItem>
								</FlyoutMenuItemContent>
							</FlyoutMenuItem>

							<ExpandableMenuItem>
								<ExpandableMenuItemTrigger>
									Expandable menu item with long content
								</ExpandableMenuItemTrigger>
								<ExpandableMenuItemContent>
									{Array.from({ length: 100 }, (_, i) => (
										<LinkMenuItem key={i} href="#" elemBefore={<InboxIcon label="" />}>
											Item {i + 1}
										</LinkMenuItem>
									))}
								</ExpandableMenuItemContent>
							</ExpandableMenuItem>
						</MenuList>
					</SideNavContent>
					<SideNavFooter>
						<Text>Sidebar footer</Text>
					</SideNavFooter>
					<SideNavPanelSplitter
						label="Resize side nav"
						onResizeEnd={({ finalWidth }) => setPersistedSideNavWidth(finalWidth)}
						tooltipContent="Double click to collapse"
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
							<Button
								isSelected={isCardGridVisible}
								onClick={() => setIsCardGridVisible((current) => !current)}
							>
								Toggle card grid
							</Button>
							<Button onClick={addFlag}>Add flag</Button>
							<Button onClick={() => setIsModalOpen(true)}>Open modal</Button>
							<Button
								onClick={() => setDirection((current) => (current === 'ltr' ? 'rtl' : 'ltr'))}
							>
								Toggle direction
							</Button>
						</Inline>
						{isMainLongPlaceholderContentVisible && <LongPlaceholderContent />}
						{isCardGridVisible && <CardGrid />}
					</Stack>

					<ModalTransition>
						{isModalOpen && (
							<Modal onClose={() => setIsModalOpen(false)}>
								<ModalHeader hasCloseButton>
									<ModalTitle>Move your page to the Design team space</ModalTitle>
								</ModalHeader>
								<ModalBody>
									If you move this page to the Design system space, your access permissions will
									change to view only. You'll need to ask the space admin for edit access.
								</ModalBody>
								<ModalFooter>
									<Button onClick={() => setIsModalOpen(false)}>Move page</Button>
								</ModalFooter>
							</Modal>
						)}
					</ModalTransition>
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
		</div>
	);
}

// Wrapping in another component so we can access the flags context in the example
export function InteractiveLayoutExample() {
	return (
		<WithResponsiveViewport>
			<FlagsProvider>
				<Example />
			</FlagsProvider>
		</WithResponsiveViewport>
	);
}

// Default export is required to work with the Codesandbox example template
export default InteractiveLayoutExample;
