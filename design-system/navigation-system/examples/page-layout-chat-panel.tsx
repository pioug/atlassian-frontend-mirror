/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, type Ref, useEffect, useMemo, useRef, useState } from 'react';

import { jsx } from '@compiled/react';
import { RelayEnvironmentProvider } from 'react-relay';
import { createMockEnvironment } from 'relay-test-utils';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import AiChatIcon from '@atlaskit/icon/core/ai-chat';
import { JiraIcon } from '@atlaskit/logo/jira/icon';
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
	Search,
} from '@atlaskit/navigation-system/top-nav-items';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';
import { LayoutWithPanel } from '@atlassian/panel-system/layout-with-panel';
import { PanelActionClose } from '@atlassian/panel-system/panel-action/close';
import { PanelActionGroup } from '@atlassian/panel-system/panel-action/group';
import { PanelBody } from '@atlassian/panel-system/panel-body';
import { PanelContainer } from '@atlassian/panel-system/panel-container';
import { PanelContent } from '@atlassian/panel-system/panel-content';
import { PanelHeader } from '@atlassian/panel-system/panel-header';
import { PanelProvider } from '@atlassian/panel-system/panel-provider';
import { PanelTitle } from '@atlassian/panel-system/panel-title';
import { Trigger } from '@atlassian/panel-system/trigger';
import { JSResourceForInteraction } from '@atlassian/react-async';
import { createEntryPoint } from '@atlassian/react-entrypoint';

import { enableChatPanelLayout } from './utils/enable-chat-panel-layout';

const localPanelEntryPoint = createEntryPoint({
	root: JSResourceForInteraction(
		() =>
			import(
				/* webpackChunkName: "@atlaskit-internal_navigation-system-chat-panel-local-panel" */ './utils/page-layout-chat-panel-local-panel'
			),
		{ moduleId: 'navigation-system-chat-panel-local-panel' },
	),
	getPreloadProps: () => ({}),
});

function RelayEnvironmentWrapper({ children }: { children: ReactNode }): JSX.Element {
	const environment = useMemo(() => createMockEnvironment(), []);

	return <RelayEnvironmentProvider environment={environment}>{children}</RelayEnvironmentProvider>;
}

function WidthReadout({
	label,
	target,
}: {
	label: string;
	target: 'parent' | string;
}): JSX.Element {
	const markerRef = useRef<HTMLSpanElement>(null);
	const [width, setWidth] = useState<number | null>(null);

	useEffect(() => {
		const marker = markerRef.current;
		const targetElement = target === 'parent' ? marker?.parentElement : marker?.closest(target);

		if (!targetElement) {
			return;
		}

		const updateWidth = () => setWidth(Math.round(targetElement.getBoundingClientRect().width));
		const resizeObserver = new ResizeObserver(updateWidth);

		updateWidth();
		resizeObserver.observe(targetElement);

		return () => resizeObserver.disconnect();
	}, [target]);

	return (
		<span ref={markerRef}>
			<Text size="large">
				{label}: {width === null ? 'measuring…' : `${width}px`}
			</Text>
		</span>
	);
}

const styles = cssMap({
	banner: {
		backgroundColor: token('color.background.accent.purple.subtle'),
	},
	topNav: {
		backgroundColor: token('color.background.accent.blue.subtlest'),
	},
	sideNav: {
		backgroundColor: token('color.background.accent.green.subtlest'),
	},
	main: {
		backgroundColor: token('elevation.surface'),
	},
	chatPanel: {
		backgroundColor: token('color.background.accent.gray.subtlest'),
	},
});

export default function ChatPanelExample(): JSX.Element {
	enableChatPanelLayout();
	const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);

	return (
		<PanelProvider>
			<RelayEnvironmentWrapper>
				<Root isSideNavShortcutEnabled>
					<Banner xcss={styles.banner}>Announcement banner</Banner>
					<TopNav xcss={styles.topNav} height={56}>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse side navigation"
									expandLabel="Expand side navigation"
								/>
							}
						>
							<AppSwitcher label="Switch apps" />
							<AppLogo href="" icon={JiraIcon} name="Jira" label="Jira home" />
						</TopNavStart>
						<TopNavMiddle>
							<Search label="Search" />
							<CreateButton>Create</CreateButton>
						</TopNavMiddle>
						<TopNavEnd>
							{!isChatPanelOpen && (
								<TopNavButton iconBefore={AiChatIcon} onClick={() => setIsChatPanelOpen(true)}>
									Ask Rovo
								</TopNavButton>
							)}
						</TopNavEnd>
					</TopNav>
					<SideNav defaultWidth={320}>
						<SideNavBody>
							<Box xcss={styles.sideNav} padding="space.200">
								<WidthReadout label="Side navigation" target="[data-layout-slot]" />
							</Box>
						</SideNavBody>
						<SideNavPanelSplitter label="Resize side navigation" />
					</SideNav>
					<Main xcss={styles.main}>
						<LayoutWithPanel testId="layout-with-panel">
							<Box padding="space.300">
								<WidthReadout label="Main" target="parent" />
								<Stack space="space.200" alignInline="start">
									<Trigger panel={localPanelEntryPoint} params={{}}>
										{({ ref }) => (
											<Button ref={ref as Ref<HTMLButtonElement>}>open local panel</Button>
										)}
									</Trigger>
									<Text>
										Panel-system panels are scoped to the main content area. The ChatPanel remains a
										separate full-height navigation-system slot.
									</Text>
									<Text>
										As the viewport narrows, Main shrinks first. Other areas then compress in local
										panel, chat panel, and side navigation order. The local panel overlays first;
										side navigation collapses below 1024px; and chat overlays when it can no longer
										fit beside Main.
									</Text>
								</Stack>
							</Box>
						</LayoutWithPanel>
					</Main>
					{isChatPanelOpen && (
						<ChatPanel xcss={styles.chatPanel} onClose={() => setIsChatPanelOpen(false)}>
							<PanelSplitter label="Resize chat panel" />
							<PanelContainer>
								<PanelHeader>
									<PanelTitle>Chat panel</PanelTitle>
									<PanelActionGroup>
										<PanelActionClose
											label="Close chat panel"
											onClick={() => setIsChatPanelOpen(false)}
										/>
									</PanelActionGroup>
								</PanelHeader>
								<PanelContent>
									<PanelBody>
										<Stack space="space.200">
											<WidthReadout label="Chat panel" target="[data-layout-slot]" />
											<Text>Drag the panel's inline-start edge to resize it.</Text>
										</Stack>
									</PanelBody>
								</PanelContent>
							</PanelContainer>
						</ChatPanel>
					)}
				</Root>
			</RelayEnvironmentWrapper>
		</PanelProvider>
	);
}
