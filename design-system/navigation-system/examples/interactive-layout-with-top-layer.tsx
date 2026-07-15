/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

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
import LinkIcon from '@atlaskit/icon/core/link';
import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';
import PersonIcon from '@atlaskit/icon/core/person';
import ProjectIcon from '@atlaskit/icon/core/project';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import StarIcon from '@atlaskit/icon/core/star-starred';
import StatusInformationIcon from '@atlaskit/icon/core/status-information';
import InlineDialog from '@atlaskit/inline-dialog';
import { useOpenLayerObserver } from '@atlaskit/layering/experimental/use-open-layer-observer';
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
	SideNavBody,
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
import { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/side-nav-items/expandable-menu-item';
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
import { Divider } from '@atlaskit/side-nav-items/menu-section';
import { SpotlightActions } from '@atlaskit/spotlight/actions';
import { SpotlightBody } from '@atlaskit/spotlight/body';
import { SpotlightCard } from '@atlaskit/spotlight/card';
import { SpotlightControls } from '@atlaskit/spotlight/controls';
import { SpotlightDismissControl } from '@atlaskit/spotlight/dismiss-control';
import { SpotlightHeader } from '@atlaskit/spotlight/header';
import { SpotlightHeadline } from '@atlaskit/spotlight/headline';
import { PopoverContent } from '@atlaskit/spotlight/popover-content';
import { PopoverProvider } from '@atlaskit/spotlight/popover-provider';
import { PopoverTarget } from '@atlaskit/spotlight/popover-target';
import { SpotlightPrimaryAction } from '@atlaskit/spotlight/primary-action';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import { Dialog } from '@atlaskit/top-layer/dialog';

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

const popupContentStyles = cssMap({
	root: {
		width: '320px',
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

const appSwitcherPopupStyles = cssMap({
	root: {
		width: '400px',
		height: '500px',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});

const inlineDialogContentStyles = cssMap({
	root: {
		minWidth: '240px',
	},
});

const observerCardStyles = cssMap({
	root: {
		marginBlockStart: token('space.200'),
		marginInline: token('space.300'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		borderRadius: token('radius.large'),
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		backgroundColor: token('elevation.surface.raised'),
	},
});

const topLayerDialogStyles = cssMap({
	card: {
		width: '480px',
		maxBlockSize: 'calc(100vh - 120px)',
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.large'),
		boxShadow: token('elevation.shadow.overlay'),
	},
	header: {
		paddingBlockStart: token('space.300'),
		paddingBlockEnd: token('space.200'),
		paddingInline: token('space.300'),
	},
	body: {
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.300'),
		paddingInline: token('space.300'),
	},
	footer: {
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.300'),
		paddingInline: token('space.300'),
	},
});

const defaultSlotWidths = {
	sideNav: 350,
	panel: 350,
	aside: 400,
};

function OpenLayerObserverReadout(): JSX.Element {
	const observer = useOpenLayerObserver();
	const [totalCount, setTotalCount] = useState<number>(0);

	useEffect(() => {
		if (!observer) {
			return undefined;
		}

		const updateCount = () => {
			setTotalCount(observer.getCount());
		};

		updateCount();

		const unsubscribe = observer.onChange(updateCount);
		return () => {
			unsubscribe();
		};
	}, [observer]);

	if (!observer) {
		return (
			<div css={observerCardStyles.root}>
				<Text>OpenLayerObserver: not available in this tree.</Text>
			</div>
		);
	}

	return (
		<div css={observerCardStyles.root}>
			<Stack space="space.050">
				<Heading size="xsmall">OpenLayerObserver (live)</Heading>
				<Text>
					Total open layers: <strong>{totalCount}</strong>
				</Text>
			</Stack>
		</div>
	);
}

function MockAppSwitcher(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => {
				setIsOpen(false);
			}}
			content={() => <div css={appSwitcherPopupStyles.root}>Mock app switcher</div>}
			placement="bottom-start"
			shouldRenderToParent
			trigger={(triggerProps) => (
				<AppSwitcher
					{...triggerProps}
					onClick={() => {
						setIsOpen((previous) => !previous);
					}}
					label="Switch apps"
					isSelected={isOpen}
				/>
			)}
		/>
	);
}

function TopNavPopupTrigger(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			shouldRenderToParent
			isOpen={isOpen}
			onClose={() => {
				setIsOpen(false);
			}}
			placement="bottom-end"
			content={() => (
				<div css={popupContentStyles.root}>
					<Stack space="space.100">
						<Heading size="xsmall">Top-nav Popup</Heading>
						<Text>
							Anchored to the trigger button. Verifies positioning, click-outside dismiss, and focus
							return inside the TopNav slot.
						</Text>
					</Stack>
				</div>
			)}
			trigger={(triggerProps) => (
				<Button
					{...triggerProps}
					onClick={() => {
						setIsOpen((previous) => !previous);
					}}
					isSelected={isOpen}
				>
					Open top-nav popup
				</Button>
			)}
		/>
	);
}

function SpotlightTrigger(): JSX.Element {
	const [isVisible, setIsVisible] = useState(false);
	const dismiss = useCallback(() => {
		setIsVisible(false);
	}, []);

	return (
		<PopoverProvider>
			<PopoverTarget>
				<Button
					isSelected={isVisible}
					onClick={() => {
						setIsVisible((previous) => !previous);
					}}
				>
					Toggle spotlight
				</Button>
			</PopoverTarget>
			<PopoverContent dismiss={dismiss} placement="bottom-end" isVisible={isVisible}>
				<SpotlightCard testId="harness-spotlight">
					<SpotlightHeader>
						<SpotlightHeadline>Try the new layering</SpotlightHeadline>
						<SpotlightControls>
							<SpotlightDismissControl />
						</SpotlightControls>
					</SpotlightHeader>
					<SpotlightBody>
						<Text>
							Spotlight is part of the top-layer migration. Verifies that PopoverContent still
							anchors correctly inside Main even when the side nav is in peek mode.
						</Text>
					</SpotlightBody>
					<SpotlightActions>
						<SpotlightPrimaryAction onClick={dismiss}>Got it</SpotlightPrimaryAction>
					</SpotlightActions>
				</SpotlightCard>
			</PopoverContent>
		</PopoverProvider>
	);
}

function InlineDialogTrigger(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<InlineDialog
			isOpen={isOpen}
			onClose={() => {
				setIsOpen(false);
			}}
			content={
				<div css={inlineDialogContentStyles.root}>
					<Stack space="space.100">
						<Heading size="xsmall">InlineDialog</Heading>
						<Text>
							InlineDialog is also a top-layer adopter. Useful as a small anchored surface that does
							not trap focus.
						</Text>
					</Stack>
				</div>
			}
		>
			<Button
				isSelected={isOpen}
				onClick={() => {
					setIsOpen((previous) => !previous);
				}}
			>
				Toggle inline dialog
			</Button>
		</InlineDialog>
	);
}

function TopLayerDialogTrigger(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<Fragment>
			<Button
				onClick={() => {
					setIsOpen(true);
				}}
			>
				Open top-layer dialog
			</Button>
			<Dialog onClose={handleClose} isOpen={isOpen} label="Top-layer dialog">
				<div css={topLayerDialogStyles.card}>
					<div css={topLayerDialogStyles.header}>
						<Heading size="small">Native top-layer Dialog</Heading>
					</div>
					<div css={topLayerDialogStyles.body}>
						<Stack space="space.100">
							<Text>
								Renders via the native &lt;dialog&gt; element with showModal(). The backdrop covers
								all nav chrome and the rest of the page becomes inert.
							</Text>
							<Text>
								Compare with the &quot;Open modal&quot; button — once @atlaskit/modal-dialog flips
								on the top-layer feature flag the two paths should look and behave identically.
							</Text>
						</Stack>
					</div>
					<div css={topLayerDialogStyles.footer}>
						<Inline space="space.100" alignInline="end">
							<Button
								appearance="subtle"
								onClick={() => {
									setIsOpen(false);
								}}
							>
								Close
							</Button>
						</Inline>
					</div>
				</div>
			</Dialog>
		</Fragment>
	);
}

function ActionsDropdown({ label }: { label: string }): JSX.Element {
	return (
		<DropdownMenu
			shouldRenderToParent
			trigger={({ triggerRef, ...triggerProps }) => (
				<IconButton
					ref={triggerRef}
					{...triggerProps}
					spacing="compact"
					appearance="subtle"
					label={label}
					icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
				/>
			)}
		>
			<DropdownItemGroup>
				<DropdownItem>Rename</DropdownItem>
				<DropdownItem>Move</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
}

function ActionsPopup({ label }: { label: string }): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => {
				setIsOpen(false);
			}}
			placement="bottom-start"
			shouldRenderToParent
			content={() => (
				<div css={popupContentStyles.root}>
					<Stack space="space.100">
						<Heading size="xsmall">Quick actions</Heading>
						<Text>
							Anchored from a `LinkMenuItem`'s `actionsOnHover` slot. Verifies that a Popup-based
							hover-action can coexist with the side nav flyout / peek hover behaviour without
							fighting it.
						</Text>
						<Inline space="space.050">
							<Button appearance="primary" onClick={() => setIsOpen(false)}>
								Confirm
							</Button>
							<Button appearance="subtle" onClick={() => setIsOpen(false)}>
								Cancel
							</Button>
						</Inline>
					</Stack>
				</div>
			)}
			trigger={(triggerProps) => (
				<IconButton
					{...triggerProps}
					spacing="compact"
					appearance="subtle"
					label={label}
					icon={(iconProps) => <LinkIcon {...iconProps} size="small" />}
					onClick={() => {
						setIsOpen((previous) => !previous);
					}}
					isSelected={isOpen}
				/>
			)}
		/>
	);
}

function Example(): JSX.Element {
	const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
	const [isBannerVisible, setIsBannerVisible] = useState(false);
	const [isAsideVisible, setIsAsideVisible] = useState(false);
	const [isPanelVisible, setIsPanelVisible] = useState(false);
	const [isSideNavDefaultCollapsed, setIsSideNavDefaultCollapsed] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// "Persisted" slot widths.
	const [persistedSideNavWidth, setPersistedSideNavWidth] = useState(defaultSlotWidths.sideNav);
	const [persistedPanelWidth, setPersistedPanelWidth] = useState(defaultSlotWidths.panel);
	const [persistedAsideWidth, setPersistedAsideWidth] = useState(defaultSlotWidths.aside);

	const [isMainLongPlaceholderContentVisible, setIsMainLongPlaceholderContentVisible] =
		useState(false);
	const [isAsideLongPlaceholderContentVisible, setIsAsideLongPlaceholderContentVisible] =
		useState(false);
	const [isPanelLongPlaceholderContentVisible, setIsPanelLongPlaceholderContentVisible] =
		useState(false);

	const { showFlag } = useFlags();
	const flagCount = useRef(1);

	const addFlag = useCallback(() => {
		const id = flagCount.current++;
		showFlag({
			description: 'Added from the harness controls.',
			icon: <StatusInformationIcon label="" color={token('color.icon.information')} />,
			id: id,
			title: `${id}: Layer harness flag`,
		});
	}, [showFlag]);

	const onSideNavResizeEnd = useCallback(({ finalWidth }: { finalWidth: number }) => {
		setPersistedSideNavWidth(finalWidth);
	}, []);
	const onAsideResizeEnd = useCallback(({ finalWidth }: { finalWidth: number }) => {
		setPersistedAsideWidth(finalWidth);
	}, []);
	const onPanelResizeEnd = useCallback(({ finalWidth }: { finalWidth: number }) => {
		setPersistedPanelWidth(finalWidth);
	}, []);

	return (
		<div dir={direction}>
			<Root defaultSideNavCollapsed={isSideNavDefaultCollapsed} isSideNavShortcutEnabled>
				{isBannerVisible && (
					<Banner xcss={bannerStyles.root} height={48}>
						<AKBanner appearance="announcement">
							Top-layer verification harness — toggle the controls in Main.
						</AKBanner>
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
						<TopNavPopupTrigger />
					</TopNavMiddle>

					<TopNavEnd>
						<Tooltip content="Help — verifies tooltip positioning above top-nav">
							<Help label="Help" />
						</Tooltip>
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
							trigger={({ triggerRef, ...triggerProps }) => (
								<Profile ref={triggerRef} label="Profile" {...triggerProps} />
							)}
						>
							<DropdownItemGroup>
								<DropdownItem>Account</DropdownItem>
								<DropdownItem>Sign out</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
					</TopNavEnd>
				</TopNav>

				<SideNav
					defaultCollapsed={isSideNavDefaultCollapsed}
					onExpand={() => {
						setIsSideNavDefaultCollapsed(false);
					}}
					onCollapse={() => {
						setIsSideNavDefaultCollapsed(true);
					}}
					defaultWidth={persistedSideNavWidth}
				>
					<SideNavHeader>
						<Heading size="medium">Sidebar header</Heading>
					</SideNavHeader>
					<SideNavBody>
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
										trigger={({ triggerRef, ...triggerProps }) => (
											<IconButton
												ref={triggerRef}
												{...triggerProps}
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
								Projects (actions slot popup)
							</LinkMenuItem>

							<LinkMenuItem
								href="#"
								elemBefore={<InboxIcon label="" />}
								actions={<ActionsDropdown label="Inbox actions" />}
							>
								Inbox (actions slot dropdown)
							</LinkMenuItem>

							<LinkMenuItem
								href="#"
								elemBefore={<PersonIcon label="" />}
								actionsOnHover={<ActionsPopup label="Quick actions" />}
							>
								People (actionsOnHover slot popup)
							</LinkMenuItem>

							<LinkMenuItem
								href="#"
								elemBefore={<StarIcon label="" />}
								actionsOnHover={<ActionsDropdown label="More options" />}
							>
								Starred (actionsOnHover slot dropdown)
							</LinkMenuItem>

							<Divider />

							{/* Top-level ExpandableMenuItem with a nested ExpandableMenuItem
							    inside it. Verifies that the expand/collapse state is owned
							    by nav and is not affected by top-layer surfaces opened from
							    inside the expanded content. */}
							<ExpandableMenuItem>
								<ExpandableMenuItemTrigger elemBefore={<ListBulletedIcon label="" />}>
									Filters
								</ExpandableMenuItemTrigger>
								<ExpandableMenuItemContent>
									<MenuList>
										<LinkMenuItem href="#">Assigned to me</LinkMenuItem>
										<LinkMenuItem href="#">Reported by me</LinkMenuItem>

										{/* Nested ExpandableMenuItem (one level of nesting). */}
										<ExpandableMenuItem>
											<ExpandableMenuItemTrigger>Custom filters</ExpandableMenuItemTrigger>
											<ExpandableMenuItemContent>
												<MenuList>
													<LinkMenuItem
														href="#"
														actionsOnHover={<ActionsDropdown label="Filter actions" />}
													>
														Open bugs
													</LinkMenuItem>
													<LinkMenuItem
														href="#"
														actionsOnHover={<ActionsDropdown label="Filter actions" />}
													>
														Sprint backlog
													</LinkMenuItem>
												</MenuList>
											</ExpandableMenuItemContent>
										</ExpandableMenuItem>
									</MenuList>
								</ExpandableMenuItemContent>
							</ExpandableMenuItem>

							<Divider />
							<FlyoutMenuItem>
								<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" />}>
									Recent
								</FlyoutMenuItemTrigger>
								<FlyoutMenuItemContent>
									<FlyoutHeader title="Recent items" closeButtonLabel="Close" />
									<FlyoutBody>
										<MenuList>
											<ButtonMenuItem elemBefore={<BoardIcon label="" />}>YNG board</ButtonMenuItem>
											<ButtonMenuItem elemBefore={<BoardIcon label="" />}>
												Design ops board
											</ButtonMenuItem>
											<Divider />
											<ButtonMenuItem elemBefore={<AlignTextLeftIcon label="" />}>
												Quarterly planning page
											</ButtonMenuItem>
										</MenuList>
									</FlyoutBody>
									<FlyoutFooter>
										<MenuList>
											<ButtonMenuItem elemBefore={<AlignTextLeftIcon label="" />}>
												View all starred items
											</ButtonMenuItem>
										</MenuList>
									</FlyoutFooter>
								</FlyoutMenuItemContent>
							</FlyoutMenuItem>

							<Divider />

							<ExpandableMenuItem>
								<ExpandableMenuItemTrigger elemBefore={<ListBulletedIcon label="" />}>
									Long list (scroll test)
								</ExpandableMenuItemTrigger>
								<ExpandableMenuItemContent>
									<MenuList>
										{Array.from({ length: 30 }, (_, index) => (
											<LinkMenuItem
												key={`long-list-item-${index}`}
												href="#"
												actionsOnHover={
													index % 5 === 0 ? <ActionsDropdown label="More options" /> : undefined
												}
											>
												{`Item ${index + 1}`}
											</LinkMenuItem>
										))}
									</MenuList>
								</ExpandableMenuItemContent>
							</ExpandableMenuItem>
						</MenuList>
					</SideNavBody>
					<SideNavFooter>
						<Text>Sidebar footer</Text>
					</SideNavFooter>
					<SideNavPanelSplitter
						label="Resize side nav"
						onResizeEnd={onSideNavResizeEnd}
						tooltipContent="Double click to collapse"
					/>
				</SideNav>

				<Main id="main-container">
					<Stack space="space.100" xcss={headingStyles.root}>
						<Heading size="large">Top-layer verification harness</Heading>
						<Text>
							This example exists to verify @atlaskit/top-layer integration with
							@atlaskit/navigation-system. Toggle the controls below and watch the OpenLayerObserver
							read-out — see the file header comment for what to look for.
						</Text>

						<Text>Slot toggles:</Text>
						<Inline space="space.100" shouldWrap>
							<Button
								isSelected={isBannerVisible}
								onClick={() => {
									setIsBannerVisible((previous) => !previous);
								}}
							>
								Toggle banner
							</Button>
							<Button
								isSelected={isAsideVisible}
								onClick={() => {
									setIsAsideVisible((previous) => !previous);
								}}
							>
								Toggle aside
							</Button>
							<Button
								isSelected={isPanelVisible}
								onClick={() => {
									setIsPanelVisible((previous) => !previous);
								}}
							>
								Toggle panel
							</Button>
							<Button
								isSelected={isMainLongPlaceholderContentVisible}
								onClick={() => {
									setIsMainLongPlaceholderContentVisible((previous) => !previous);
								}}
							>
								Toggle main long content
							</Button>
							<Button
								onClick={() => {
									setDirection((current) => (current === 'ltr' ? 'rtl' : 'ltr'));
								}}
							>
								Toggle direction (RTL)
							</Button>
						</Inline>

						<Text>Layer triggers:</Text>
						<Inline space="space.100" shouldWrap>
							<Button onClick={addFlag}>Add flag</Button>
							<Button
								onClick={() => {
									setIsModalOpen(true);
								}}
							>
								Open modal
							</Button>
							<TopLayerDialogTrigger />
							<SpotlightTrigger />
							<InlineDialogTrigger />
						</Inline>

						{isMainLongPlaceholderContentVisible && <LongPlaceholderContent />}
					</Stack>

					<OpenLayerObserverReadout />

					<ModalTransition>
						{isModalOpen && (
							<Modal onClose={() => setIsModalOpen(false)}>
								<ModalHeader hasCloseButton>
									<ModalTitle>Modal — verifies modal layering above nav</ModalTitle>
								</ModalHeader>
								<ModalBody>
									<Stack space="space.100">
										<Text>
											Verifies that a modal layer sits above all nav chrome, blocks the side nav
											keyboard shortcut, and restores focus to the trigger on close.
										</Text>
										<Text>
											Once @atlaskit/modal-dialog flips on the top-layer feature flag, this also
											verifies that the native dialog backdrop covers nav chrome correctly and makes
											the rest of the page inert. Compare with the &quot;Open top-layer dialog&quot;
											button for the post-migration target behaviour.
										</Text>
									</Stack>
								</ModalBody>
								<ModalFooter>
									<Button
										onClick={() => {
											setIsModalOpen(false);
										}}
									>
										Close
									</Button>
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
							{/* Wrapping div added to prevent Button from taking full width. */}
							<div>
								<Button
									isSelected={isAsideLongPlaceholderContentVisible}
									onClick={() => {
										setIsAsideLongPlaceholderContentVisible((previous) => !previous);
									}}
								>
									Toggle aside long content
								</Button>
							</div>
							{isAsideLongPlaceholderContentVisible && <LongPlaceholderContent />}
						</Stack>
						<PanelSplitter label="Resize aside" onResizeEnd={onAsideResizeEnd} />
					</Aside>
				)}

				{isPanelVisible && (
					<Panel defaultWidth={persistedPanelWidth}>
						<Stack space="space.100" xcss={panelStyles.content}>
							<Heading size="medium">Panel layout area</Heading>
							<Text>
								This element is rendered in the panel layout area. Panel becomes an overlay on small
								/ medium viewports (verification row A8). Try opening the FlyoutMenuItem above while
								Panel is overlaid to test stacking.
							</Text>
							<div>
								<Button
									isSelected={isPanelLongPlaceholderContentVisible}
									onClick={() => {
										setIsPanelLongPlaceholderContentVisible((previous) => !previous);
									}}
								>
									Toggle panel long content
								</Button>
							</div>
							{isPanelLongPlaceholderContentVisible && <LongPlaceholderContent />}
						</Stack>
						<PanelSplitter label="Resize panel" onResizeEnd={onPanelResizeEnd} />
					</Panel>
				)}
			</Root>
		</div>
	);
}

function InteractiveLayoutWithTopLayerExample(): JSX.Element {
	return (
		<WithResponsiveViewport>
			<FlagsProvider>
				<Example />
			</FlagsProvider>
		</WithResponsiveViewport>
	);
}

export default InteractiveLayoutWithTopLayerExample;
