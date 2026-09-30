/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, type Ref, useMemo, useRef, useState } from 'react';

import { jsx } from '@compiled/react';
import { RelayEnvironmentProvider } from 'react-relay';
import { createMockEnvironment } from 'relay-test-utils';

import Avatar from '@atlaskit/avatar/avatar';
import Badge from '@atlaskit/badge/badge';
import Button from '@atlaskit/button/default/button';
import IconButton from '@atlaskit/button/icon/button';
import { cssMap } from '@atlaskit/css';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import Heading from '@atlaskit/heading/heading';
import AddIcon from '@atlaskit/icon/core/add';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AppsIcon from '@atlaskit/icon/core/apps';
import CheckboxCheckedIcon from '@atlaskit/icon/core/checkbox-checked';
import ClockIcon from '@atlaskit/icon/core/clock';
import CrossIcon from '@atlaskit/icon/core/cross';
import EditIcon from '@atlaskit/icon/core/edit';
import EpicIcon from '@atlaskit/icon/core/epic';
import GoalIcon from '@atlaskit/icon/core/goal';
import InboxIcon from '@atlaskit/icon/core/inbox';
import LinkIcon from '@atlaskit/icon/core/link';
import LocationIcon from '@atlaskit/icon/core/location';
import LockLockedIcon from '@atlaskit/icon/core/lock-locked';
import MagicWandIcon from '@atlaskit/icon/core/magic-wand';
import MenuIcon from '@atlaskit/icon/core/menu';
import MicrophoneIcon from '@atlaskit/icon/core/microphone';
import PageIcon from '@atlaskit/icon/core/page';
import ProjectIcon from '@atlaskit/icon/core/project';
import RovoChatIcon from '@atlaskit/icon/core/rovo-chat';
import SendIcon from '@atlaskit/icon/core/send';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import TextSpellcheckIcon from '@atlaskit/icon/core/text-spellcheck';
import Image from '@atlaskit/image/image';
import { ConfluenceIcon } from '@atlaskit/logo/confluence/icon';
import { RovoIcon } from '@atlaskit/logo/rovo/icon';
import Lozenge from '@atlaskit/lozenge/lozenge';
import { Banner } from '@atlaskit/navigation-system/layout/banner';
import { ChatPanel } from '@atlaskit/navigation-system/layout/chat-panel';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavBody,
	SideNavPanelSplitter,
	SideNavToggleButton,
} from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import { TopNavButton } from '@atlaskit/navigation-system/theming/top-nav-button';
import {
	AppLogo,
	AppSwitcher,
	CreateButton,
	Help,
	Notifications,
	Profile,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/side-nav-items/expandable-menu-item';
import { LinkMenuItem } from '@atlaskit/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { MenuListItem } from '@atlaskit/side-nav-items/menu-list-item';
import TextArea from '@atlaskit/textarea/text-area';
import { token } from '@atlaskit/tokens';
import { LayoutWithPanel } from '@atlassian/panel-system/layout-with-panel';
import { PanelProvider } from '@atlassian/panel-system/panel-provider';
import { Trigger } from '@atlassian/panel-system/trigger';
import { JSResourceForInteraction } from '@atlassian/react-async';
import { createEntryPoint } from '@atlassian/react-entrypoint';

import dstLogo from './images/dst.png';
import { enableChatPanelLayout } from './utils/enable-chat-panel-layout';
import { WithResponsiveViewport } from './utils/example-utils';
import { MockSearch } from './utils/mock-search';

const projectPanelEntryPoint = createEntryPoint({
	root: JSResourceForInteraction(
		() =>
			import(
				/* webpackChunkName: "@atlaskit-internal_navigation-system-chat-panel-confluence-panel" */ './utils/page-layout-chat-panel-confluence-mock-local-panel'
			),
		{ moduleId: 'navigation-system-chat-panel-confluence-panel' },
	),
	getPreloadProps: () => ({}),
});

const epicPanelEntryPoint = createEntryPoint({
	root: JSResourceForInteraction(
		() =>
			import(
				/* webpackChunkName: "@atlaskit-internal_navigation-system-chat-panel-confluence-epic-panel" */ './utils/page-layout-chat-panel-confluence-mock-epic-panel'
			),
		{ moduleId: 'navigation-system-chat-panel-confluence-epic-panel' },
	),
	getPreloadProps: () => ({}),
});

const keyResultPanelEntryPoint = createEntryPoint({
	root: JSResourceForInteraction(
		() =>
			import(
				/* webpackChunkName: "@atlaskit-internal_navigation-system-chat-panel-confluence-kr-panel" */ './utils/page-layout-chat-panel-confluence-mock-kr-panel'
			),
		{ moduleId: 'navigation-system-chat-panel-confluence-kr-panel' },
	),
	getPreloadProps: () => ({}),
});

const pageStyles = cssMap({
	banner: {
		backgroundColor: token('color.background.accent.blue.subtlest'),
	},
	bannerContent: {
		alignItems: 'center',
		display: 'flex',
		height: '100%',
		paddingInline: token('space.200'),
	},
	content: {
		alignItems: 'center',
		width: '100%',
	},
	header: {
		alignItems: 'center',
		boxSizing: 'border-box',
		display: 'flex',
		gap: token('space.100'),
		flexShrink: 0,
		height: '56px',
		justifyContent: 'flex-end',
		paddingInline: token('space.200'),
		width: '100%',
	},
	pageActions: {
		alignItems: 'center',
		border: `${token('border.width')} solid ${token('color.border')}`,
		borderRadius: token('radius.small'),
		display: 'flex',
		flexShrink: 0,
	},
	copyLink: {
		borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
	},
	body: {
		maxWidth: '900px',
		paddingBlock: token('space.400'),
		paddingInline: token('space.500'),
	},
	byline: {
		alignItems: 'center',
		display: 'flex',
		flexWrap: 'wrap',
		gap: token('space.100'),
	},
	metadataTable: {
		border: `${token('border.width')} solid ${token('color.border')}`,
		borderRadius: token('radius.medium'),
		overflow: 'hidden',
	},
	metadataRow: {
		borderBlockEnd: `${token('border.width')} solid ${token('color.border')}`,
		display: 'grid',
		gridTemplateColumns: '132px minmax(0, 1fr)',
	},
	metadataLastRow: {
		borderBlockEnd: 'none',
	},
	metadataLabel: {
		backgroundColor: token('color.background.neutral.subtle'),
		borderInlineEnd: `${token('border.width')} solid ${token('color.border')}`,
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
	},
	metadataValue: {
		alignItems: 'center',
		display: 'flex',
		flexWrap: 'wrap',
		gap: token('space.075'),
		minWidth: 0,
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
	},
	personPill: {
		alignItems: 'center',
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.full'),
		display: 'inline-flex',
		gap: token('space.050'),
		paddingInlineEnd: token('space.100'),
	},
	anchorLinks: {
		display: 'flex',
		flexWrap: 'wrap',
		gap: token('space.050'),
	},
	contentList: {
		marginBlock: 0,
		paddingInlineStart: token('space.300'),
	},
	smartLinkRow: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.100'),
	},
	smartLink: {
		alignItems: 'center',
		backgroundColor: token('elevation.surface'),
		border: `${token('border.width')} solid ${token('color.border')}`,
		borderRadius: token('radius.small'),
		display: 'inline-flex',
		gap: token('space.050'),
		maxWidth: '100%',
		paddingBlock: token('space.025'),
		paddingInline: token('space.050'),
		'&:hover': {
			backgroundColor: token('elevation.surface.hovered'),
		},
	},
	smartLinkText: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	smartLinkStack: {
		alignItems: 'flex-start',
		width: '100%',
	},
	sideNavHeader: {
		backgroundColor: token('elevation.surface'),
		borderBlockStart: `${token('border.width')} solid ${token('color.border')}`,
		marginBlockStart: token('space.150'),
		paddingBlock: token('space.150'),
	},
});

const chatStyles = cssMap({
	root: {
		backgroundColor: token('elevation.surface'),
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		minWidth: 0,
	},
	header: {
		alignItems: 'center',
		borderBlockEnd: `${token('border.width')} solid ${token('color.border')}`,
		display: 'flex',
		height: '56px',
		justifyContent: 'space-between',
		paddingInline: token('space.150'),
	},
	headerBrand: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.100'),
		minWidth: 0,
	},
	content: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		minHeight: 0,
		overflow: 'auto',
	},
	tabs: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.050'),
		justifyContent: 'center',
		paddingBlock: token('space.200'),
	},
	tabSelected: {
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.full'),
		fontWeight: token('font.weight.semibold'),
		paddingBlock: token('space.075'),
		paddingInline: token('space.150'),
	},
	tab: {
		borderRadius: token('radius.full'),
		paddingBlock: token('space.075'),
		paddingInline: token('space.150'),
	},
	emptyState: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		minHeight: '360px',
		paddingBlockEnd: token('space.300'),
		paddingInline: token('space.300'),
	},
	greeting: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.150'),
		marginBlockEnd: token('space.250'),
		textAlign: 'center',
	},
	rovoMark: {
		alignItems: 'center',
		backgroundColor: token('color.background.accent.purple.subtler'),
		borderRadius: token('radius.full'),
		display: 'flex',
		height: '56px',
		justifyContent: 'center',
		width: '56px',
	},
	suggestions: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.025'),
		marginInline: 'auto',
		maxWidth: '360px',
		width: '100%',
	},
	suggestion: {
		alignItems: 'center',
		backgroundColor: token('elevation.surface'),
		borderRadius: token('radius.medium'),
		display: 'flex',
		gap: token('space.150'),
		paddingBlock: token('space.075'),
		paddingInline: token('space.050'),
		textAlign: 'start',
		width: '100%',
		'&:hover': {
			backgroundColor: token('elevation.surface.hovered'),
		},
	},
	suggestionIcon: {
		alignItems: 'center',
		border: `${token('border.width')} solid ${token('color.border')}`,
		borderRadius: token('radius.medium'),
		display: 'flex',
		height: '32px',
		justifyContent: 'center',
		width: '32px',
	},
	composerArea: {
		paddingBlockEnd: token('space.100'),
		paddingInline: token('space.200'),
	},
	context: {
		alignItems: 'center',
		backgroundColor: token('elevation.surface.sunken'),
		borderRadius: token('radius.medium'),
		display: 'flex',
		gap: token('space.075'),
		marginBlockEnd: token('space.100'),
		paddingBlock: token('space.075'),
		paddingInline: token('space.100'),
	},
	contextLink: {
		alignItems: 'center',
		color: token('color.link'),
		display: 'flex',
		fontWeight: token('font.weight.medium'),
		gap: token('space.050'),
		minWidth: 0,
	},
	contextDismiss: {
		marginInlineStart: 'auto',
	},
	composer: {
		backgroundColor: token('color.background.input'),
		border: `${token('border.width')} solid ${token('color.border')}`,
		borderRadius: token('radius.large'),
		boxShadow: token('elevation.shadow.overflow'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	composerActions: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'space-between',
		paddingBlockStart: token('space.075'),
	},
	auto: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.050'),
	},
	disclaimer: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		paddingBlock: token('space.100'),
	},
});

function RelayEnvironmentWrapper({ children }: { children: ReactNode }): JSX.Element {
	const environment = useMemo(() => createMockEnvironment(), []);

	return <RelayEnvironmentProvider environment={environment}>{children}</RelayEnvironmentProvider>;
}

function RovoChatMock({ onClose }: { onClose: () => void }): JSX.Element {
	const [hasContext, setHasContext] = useState(true);

	return (
		<div css={chatStyles.root}>
			<div css={chatStyles.header}>
				<div css={chatStyles.headerBrand}>
					<IconButton appearance="subtle" icon={MenuIcon} label="Open Rovo menu" />
					<RovoIcon appearance="brand" size="xsmall" label="" />
					<Text weight="bold">Rovo</Text>
				</div>
				<Inline alignBlock="center" space="space.025">
					<IconButton appearance="subtle" icon={EditIcon} label="New chat" />
					<IconButton appearance="subtle" icon={ShowMoreHorizontalIcon} label="More actions" />
					<IconButton appearance="subtle" icon={CrossIcon} label="Close Rovo" onClick={onClose} />
				</Inline>
			</div>
			<div css={chatStyles.content}>
				<div css={chatStyles.tabs}>
					<Pressable xcss={chatStyles.tabSelected}>Quick actions</Pressable>
					<Pressable xcss={chatStyles.tab}>Your work</Pressable>
				</div>
				<div css={chatStyles.emptyState}>
					<div css={chatStyles.greeting}>
						<div css={chatStyles.rovoMark}>
							<RovoChatIcon label="" size="medium" />
						</div>
						<Heading as="h2" size="large">
							Need help editing your copied page?
						</Heading>
					</div>
					<div css={chatStyles.suggestions}>
						<Pressable xcss={chatStyles.suggestion}>
							<Box xcss={chatStyles.suggestionIcon}>
								<MagicWandIcon label="" />
							</Box>
							<Text>Improve writing</Text>
						</Pressable>
						<Pressable xcss={chatStyles.suggestion}>
							<Box xcss={chatStyles.suggestionIcon}>
								<AlignTextLeftIcon label="" />
							</Box>
							<Text>Improve formatting</Text>
						</Pressable>
						<Pressable xcss={chatStyles.suggestion}>
							<Box xcss={chatStyles.suggestionIcon}>
								<TextSpellcheckIcon label="" />
							</Box>
							<Text>Fix spelling &amp; grammar</Text>
						</Pressable>
					</div>
				</div>
				<div css={chatStyles.composerArea}>
					{hasContext && (
						<div css={chatStyles.context}>
							<LocationIcon label="" color={token('color.icon.subtle')} />
							<Text color="color.text.subtle">Context:</Text>
							<div css={chatStyles.contextLink}>
								<PageIcon label="" />
								<Text color="color.link">Specs: Layout behaviour</Text>
							</div>
							<Box xcss={chatStyles.contextDismiss}>
								<IconButton
									appearance="subtle"
									icon={CrossIcon}
									label="Remove context"
									onClick={() => setHasContext(false)}
									spacing="compact"
								/>
							</Box>
						</div>
					)}
					<div css={chatStyles.composer}>
						<TextArea
							appearance="none"
							id="rovo-prompt"
							name="rovo-prompt"
							placeholder="Ask, @mention, or / for actions"
							resize="none"
						/>
						<div css={chatStyles.composerActions}>
							<IconButton appearance="subtle" icon={AddIcon} label="Add attachment" />
							<Inline alignBlock="center" space="space.050">
								<div css={chatStyles.auto}>
									<MagicWandIcon label="" />
									<Text weight="medium">Auto</Text>
								</div>
								<IconButton appearance="subtle" icon={MicrophoneIcon} label="Dictate" />
								<IconButton appearance="subtle" icon={SendIcon} label="Send" isDisabled />
							</Inline>
						</div>
					</div>
					<div css={chatStyles.disclaimer}>
						<Text size="small" color="color.text.subtlest">
							Uses AI. Verify results.
						</Text>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function PageLayoutChatPanelConfluenceMockExample(): JSX.Element {
	enableChatPanelLayout();
	const sideNavContentRef = useRef<HTMLDivElement>(null);
	const [isChatPanelOpen, setIsChatPanelOpen] = useState(true);

	return (
		<WithResponsiveViewport>
			<PanelProvider>
				<RelayEnvironmentWrapper>
					<Root testId="root" isSideNavShortcutEnabled>
						<Banner xcss={pageStyles.banner}>
							<div css={pageStyles.bannerContent}>
								Rovo can now help improve and format this page.
							</div>
						</Banner>
						<TopNav height={56}>
							<TopNavStart
								sideNavToggleButton={
									<SideNavToggleButton
										collapseLabel="Collapse sidebar"
										expandLabel="Expand sidebar"
									/>
								}
							>
								<AppSwitcher label="Switch apps" />
								<AppLogo href="" icon={ConfluenceIcon} name="Confluence" label="Home page" />
							</TopNavStart>
							<TopNavMiddle>
								<MockSearch />
								<CreateButton>Create</CreateButton>
							</TopNavMiddle>
							<TopNavEnd>
								<TopNavButton
									iconBefore={(props) => <RovoIcon {...props} size="xxsmall" label="" />}
									isSelected={isChatPanelOpen}
									onClick={() => setIsChatPanelOpen((isOpen) => !isOpen)}
								>
									Ask Rovo
								</TopNavButton>
								<Help label="Help" />
								<Notifications
									badge={() => (
										<Badge max={9} appearance="dangerBold">
											3
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
						<SideNav defaultWidth={320}>
							<SideNavBody ref={sideNavContentRef}>
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
									<LinkMenuItem href="#" elemBefore={<ClockIcon label="" color="currentColor" />}>
										Recent
									</LinkMenuItem>
								</MenuList>
								<Box xcss={pageStyles.sideNavHeader}>
									<ButtonMenuItem
										elemBefore={<Image src={dstLogo} width="24" height="24" alt="" />}
									>
										Design System
									</ButtonMenuItem>
								</Box>
								<ExpandableMenuItem isDefaultExpanded>
									<ExpandableMenuItemTrigger>Content</ExpandableMenuItemTrigger>
									<ExpandableMenuItemContent>
										{['Overview', 'Foundations', 'Components', 'Patterns', 'Resources'].map(
											(item) => (
												<LinkMenuItem href="#" key={item}>
													{item}
												</LinkMenuItem>
											),
										)}
									</ExpandableMenuItemContent>
								</ExpandableMenuItem>
							</SideNavBody>
							<SideNavPanelSplitter label="Resize side navigation" />
						</SideNav>
						<Main id="main-container">
							<LayoutWithPanel testId="layout-with-panel">
								<Stack xcss={pageStyles.content}>
									<div css={pageStyles.header} role="group" aria-label="Page actions">
										<Text size="small" color="color.text.subtle">
											Edited Sep 11
										</Text>
										<Avatar size="small" name="Taylor Morgan" />
										<div css={pageStyles.pageActions}>
											<Button appearance="subtle" spacing="compact" iconBefore={LockLockedIcon}>
												Share
											</Button>
											<div css={pageStyles.copyLink}>
												<IconButton
													appearance="subtle"
													spacing="compact"
													icon={LinkIcon}
													label="Copy page link"
												/>
											</div>
										</div>
										<IconButton
											appearance="subtle"
											spacing="compact"
											icon={ShowMoreHorizontalIcon}
											label="More page actions"
										/>
									</div>
									<Stack xcss={pageStyles.body} space="space.400">
										<Heading as="h1" size="xlarge">
											Phase 2: Layout updates for chat panel (Project poster)
										</Heading>

										<div css={pageStyles.byline}>
											<Avatar size="xsmall" name="Taylor Morgan" />
											<Text size="small" color="color.text.subtle">
												By Taylor Morgan
											</Text>
											<Text size="small" color="color.text.subtle">
												▣ 4 min
											</Text>
											<Text size="small" color="color.text.subtle">
												♬ Listen
											</Text>
											<Text size="small" color="color.text.subtle">
												↗ 17
											</Text>
											<Text size="small" color="color.text.subtle">
												☺ Add a reaction
											</Text>
										</div>

										<div css={pageStyles.metadataTable}>
											<div css={pageStyles.metadataRow}>
												<div css={pageStyles.metadataLabel}>
													<Text weight="bold">Summary</Text>
												</div>
												<div css={pageStyles.metadataValue}>
													<Text>
														Deliver the layout solution that enables Rovo Chat to coexist with
														panels.
													</Text>
												</div>
											</div>
											<div css={pageStyles.metadataRow}>
												<div css={pageStyles.metadataLabel}>
													<Text weight="bold">Team</Text>
												</div>
												<div css={pageStyles.metadataValue}>
													<div css={pageStyles.personPill}>
														<Avatar size="xsmall" name="Alex Chen" />
														<Text>Alex Chen</Text>
													</div>
													<div css={pageStyles.personPill}>
														<Avatar size="xsmall" name="Jordan Lee" />
														<Text>Jordan Lee</Text>
													</div>
												</div>
											</div>
											<div css={pageStyles.metadataRow}>
												<div css={pageStyles.metadataLabel}>
													<Text weight="bold">Project</Text>
												</div>
												<div css={pageStyles.metadataValue}>
													<Trigger panel={projectPanelEntryPoint} params={{}}>
														{({ ref }) => (
															<Pressable
																ref={ref as Ref<HTMLButtonElement>}
																xcss={pageStyles.smartLink}
															>
																<CheckboxCheckedIcon label="" color={token('color.icon.brand')} />
																<Box xcss={pageStyles.smartLinkText}>
																	<Text color="color.link">
																		ADS layout updates for chat panel – Beta release
																	</Text>
																</Box>
																<Lozenge appearance="success">On track</Lozenge>
															</Pressable>
														)}
													</Trigger>
												</div>
											</div>
											<div css={pageStyles.metadataRow}>
												<div css={pageStyles.metadataLabel}>
													<Text weight="bold">Epic</Text>
												</div>
												<div css={pageStyles.metadataValue}>
													<Trigger panel={epicPanelEntryPoint} params={{}}>
														{({ ref }) => (
															<Pressable
																ref={ref as Ref<HTMLButtonElement>}
																xcss={pageStyles.smartLink}
															>
																<EpicIcon label="" color={token('color.icon.accent.purple')} />
																<Box xcss={pageStyles.smartLinkText}>
																	<Text color="color.link">
																		CAT-2001: ADS Panel System Beta Release
																	</Text>
																</Box>
																<Lozenge appearance="inprogress">In progress</Lozenge>
															</Pressable>
														)}
													</Trigger>
												</div>
											</div>
											<div css={[pageStyles.metadataRow, pageStyles.metadataLastRow]}>
												<div css={pageStyles.metadataLabel}>
													<Text weight="bold">KR</Text>
												</div>
												<div css={pageStyles.metadataValue}>
													<Stack xcss={pageStyles.smartLinkStack} space="space.050">
														<Trigger panel={keyResultPanelEntryPoint} params={{}}>
															{({ ref }) => (
																<Pressable
																	ref={ref as Ref<HTMLButtonElement>}
																	xcss={pageStyles.smartLink}
																>
																	<GoalIcon label="" color={token('color.icon.accent.green')} />
																	<Box xcss={pageStyles.smartLinkText}>
																		<Text color="color.link">
																			[Design L2.KR3] — Enhance design and content systems so that
																			they power the full 'stack'
																		</Text>
																	</Box>
																</Pressable>
															)}
														</Trigger>
														<Inline space="space.050">
															<Lozenge appearance="success">On track</Lozenge>
															<Lozenge appearance="success">0.7</Lozenge>
														</Inline>
													</Stack>
												</div>
											</div>
										</div>

										<div css={pageStyles.anchorLinks}>
											{[
												'Background',
												'Goal',
												'Proposed solution',
												'Milestones',
												'Requirements / scope',
												'Layout',
												'Top nav',
												'Questions to answer',
												'Project plan',
											].map((item) => (
												<Text color="color.link" key={item}>
													[ {item} ]
												</Text>
											))}
										</div>

										<Stack space="space.150">
											<Heading as="h2" size="large">
												Background
											</Heading>
											<Text as="p">
												In FY26, the design system released a new panel component to Beta, providing
												an area for contextual or supporting information alongside the main app
												content.
											</Text>
											<Text as="p">
												The team identified that Rovo Chat needs to remain persistently available
												when a local panel is open. Without a dedicated layout area, opening Chat
												can close the panel and break the user's workflow context.
											</Text>
											<Text as="p">The proposed layout work includes:</Text>
											<Box as="ul" xcss={pageStyles.contentList}>
												<li>
													<Text>
														A width system with default, minimum, and maximum sizes for every area.
													</Text>
												</li>
												<li>
													<Text>
														Fluid automatic resizing that keeps areas inline for as long as
														possible.
													</Text>
												</li>
												<li>
													<Text>Predictable user drag-to-resize behaviour.</Text>
												</li>
												<li>
													<Text>Top-nav responsiveness based on container size.</Text>
												</li>
											</Box>
										</Stack>

										<Stack space="space.150">
											<Heading as="h2" size="large">
												Goal
											</Heading>
											<Text as="p">
												Deliver a layout solution that enables the Rovo Chat panel to persist
												alongside a local panel.
											</Text>
										</Stack>

										<Stack space="space.150">
											<Heading as="h2" size="large">
												Proposed solution
											</Heading>
											<Text as="p">
												The layout behaviour defined in the design proposal carries forward into
												this phase, allowing chat and contextual panels to coexist without obscuring
												the page whenever sufficient space is available.
											</Text>
											<Box as="ul" xcss={pageStyles.contentList}>
												<li>
													<Text color="color.link">Interactive layout prototype</Text>
												</li>
												<li>
													<Text color="color.link">Specs: Layout behaviour</Text>
												</li>
												<li>
													<Text color="color.link">Specs: Top nav changes</Text>
												</li>
											</Box>
										</Stack>
									</Stack>
								</Stack>
							</LayoutWithPanel>
						</Main>
						{isChatPanelOpen && (
							<ChatPanel defaultWidth={400} onClose={() => setIsChatPanelOpen(false)}>
								<PanelSplitter label="Resize Rovo" />
								<RovoChatMock onClose={() => setIsChatPanelOpen(false)} />
							</ChatPanel>
						)}
					</Root>
				</RelayEnvironmentWrapper>
			</PanelProvider>
		</WithResponsiveViewport>
	);
}
