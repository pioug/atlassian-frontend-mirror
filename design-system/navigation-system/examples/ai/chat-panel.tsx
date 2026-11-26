import React, { useId, useRef, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Heading from '@atlaskit/heading/heading';
import { ChatPanel } from '@atlaskit/navigation-system/layout/chat-panel';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { TopNav, TopNavEnd } from '@atlaskit/navigation-system/layout/top-nav';
import { ChatButton } from '@atlaskit/navigation-system/top-nav-items';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

export default function ChatPanelExample(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const chatPanelId = useId();
	const chatButtonRef = useRef<HTMLButtonElement | null>(null);

	const closeChatAndRestoreFocus = () => {
		setIsOpen(false);
		chatButtonRef.current?.focus();
	};

	const onChatClose = () => {
		const ownerDocument = chatButtonRef.current?.ownerDocument;
		const panel = ownerDocument?.getElementById(chatPanelId);
		const hadFocus = panel?.contains(ownerDocument?.activeElement ?? null);
		setIsOpen(false);
		// Preserve external focus, but do not leave focus on content we are removing.
		if (hadFocus) {
			chatButtonRef.current?.focus();
		}
	};

	return (
		<Root>
			<TopNav>
				<TopNavEnd>
					{/* The host owns the rollout; do not override its feature flag resolver. */}
					{fg('platform-dst-chat-panel-layout') && (
						<ChatButton
							isSelected={isOpen}
							onClick={(event) => {
								chatButtonRef.current = event.currentTarget;
								setIsOpen(true);
							}}
						>
							Ask Rovo
						</ChatButton>
					)}
				</TopNavEnd>
			</TopNav>
			<Main>
				<Box padding="space.300">
					<Heading size="large">Project overview</Heading>
				</Box>
			</Main>
			{isOpen && (
				<ChatPanel
					id={chatPanelId}
					label="Rovo"
					defaultWidth={400}
					compactDefaultWidth={320}
					onClose={onChatClose}
				>
					<PanelSplitter label="Resize Rovo" />
					<Box padding="space.300">
						<Stack space="space.200" alignInline="start">
							<Heading size="medium">Rovo</Heading>
							<Text>Use this area for your chat experience.</Text>
							<Button onClick={closeChatAndRestoreFocus}>Close chat</Button>
						</Stack>
					</Box>
				</ChatPanel>
			)}
		</Root>
	);
}
