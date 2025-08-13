/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useState } from 'react';

import { jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar';
import Badge from '@atlaskit/badge';
import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import AiChatIcon from '@atlaskit/icon/core/ai-chat';
import CrossIcon from '@atlaskit/icon/core/cross';
import GrowDiagonalIcon from '@atlaskit/icon/core/grow-diagonal';
import { ConfluenceIcon } from '@atlaskit/logo';
import { TopNavButton } from '@atlaskit/navigation-system/experimental/top-nav-button';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Panel } from '@atlaskit/navigation-system/layout/panel';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
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
	Notifications,
	Profile,
} from '@atlaskit/navigation-system/top-nav-items';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import koalaImg from './images/koala.svg';
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
		zIndex: 1,
		overflow: 'hidden',
		height: '57px',
	},
	body: {
		paddingInline: token('space.300'),
		paddingBlock: token('space.300'),
		gap: token('space.250'),
	},
});

const contentStyles = cssMap({
	root: {
		alignItems: 'center',
		width: '100%',
	},
	header: {
		width: '100%',
		height: '160px',
		position: 'relative',
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: token('color.background.accent.green.bolder'),
		backgroundClip: 'content-box',
		paddingBlockEnd: token('space.800'),
	},
	logo: {
		position: 'absolute',
		bottom: 0,
	},
	body: {
		paddingInline: token('space.500'),
		paddingBlock: token('space.200'),
		maxWidth: '760px',
	},
	title: {
		textAlign: 'center',
	},
});

/**
 * A (very loose) mock of a Company Hub page.
 *
 * This could be fleshed out a lot more, but the main motive was to have a page which:
 *
 * - Has a `Panel`
 * - Does not have a `SideNav`
 */
export function CompanyHubMockExample({ defaultPanelWidth = 440 }: { defaultPanelWidth?: number }) {
	const [isChatOpen, setIsChatOpen] = useState(true);

	const toggleChat = useCallback(() => {
		setIsChatOpen((isOpen) => !isOpen);
	}, []);

	return (
		<WithResponsiveViewport>
			<Root testId="root">
				<TopNav>
					<TopNavStart>
						<AppSwitcher label="Switch apps" />
						<AppLogo href="" icon={ConfluenceIcon} name="Confluence" label="Home page" />
					</TopNavStart>
					<TopNavMiddle>
						<MockSearch />
						<CreateButton>Create</CreateButton>
					</TopNavMiddle>
					<TopNavEnd>
						<MenuListItem>
							<TopNavButton iconBefore={AiChatIcon} onClick={toggleChat} isSelected={isChatOpen}>
								Chat
							</TopNavButton>
						</MenuListItem>
						<Notifications
							badge={() => (
								<Badge max={9} appearance="important">
									{99999}
								</Badge>
							)}
							label="Notifications"
						/>
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
				<Main id="main-container">
					<Stack xcss={contentStyles.root}>
						<div css={contentStyles.header}>
							<div css={contentStyles.logo}>
								<Avatar src={koalaImg} size="xlarge" />
							</div>
						</div>
						<Stack xcss={contentStyles.body} space="space.400">
							<div css={contentStyles.title}>
								<Heading as="h1" size="xxlarge">
									Koala & Co.
								</Heading>
							</div>
							<Stack space="space.150">
								<Text as="p">
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum non corporis magni
									officiis. Commodi, iste ex. Explicabo, reiciendis ut soluta dicta impedit aperiam
									harum nihil ducimus vero perspiciatis id laudantium!
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
				{isChatOpen && (
					<Panel defaultWidth={defaultPanelWidth}>
						<Inline xcss={panelStyles.header}>
							<Text weight="bold" color="color.text.subtle">
								Chat
							</Text>
							<Inline space="space.100">
								<Inline space="space.050">
									<IconButton
										icon={GrowDiagonalIcon}
										label="Fullscreen"
										appearance="subtle"
										isTooltipDisabled={false}
									/>
								</Inline>
								<IconButton
									icon={(iconProps) => <CrossIcon {...iconProps} size="small" />}
									label="Close"
									isTooltipDisabled={false}
								/>
							</Inline>
						</Inline>
						<Box xcss={panelStyles.body}>Hello world</Box>
						<PanelSplitter label="Resize panel" />
					</Panel>
				)}
			</Root>
		</WithResponsiveViewport>
	);
}

export const CompanyHubMockSmallDefaultPanelWidthExample = () => (
	<CompanyHubMockExample defaultPanelWidth={320} />
);

export default CompanyHubMockExample;
