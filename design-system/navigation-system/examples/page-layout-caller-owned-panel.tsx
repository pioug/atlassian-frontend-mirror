import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Heading from '@atlaskit/heading/heading';
import { ChatPanel } from '@atlaskit/navigation-system/layout/chat-panel';
import { Main } from '@atlaskit/navigation-system/layout/main';
import {
	type localPanelWidthVar,
	PanelLayout,
	type PanelResizeEnd,
} from '@atlaskit/navigation-system/layout/panel-layout';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavBody,
	SideNavPanelSplitter,
	SideNavToggleButton,
} from '@atlaskit/navigation-system/layout/side-nav';
import { TopNav, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';

/**
 * No Panel System dependency: a product can keep its existing provider and content here.
 * Enable platform-dst-chat-panel-layout in the example toolbar to coordinate all three regions.
 */
export default function CallerOwnedPanelExample(): JSX.Element {
	const [open, setOpen] = useState(true);
	const [chatOpen, setChatOpen] = useState(false);
	const [content, setContent] = useState('First preview');
	const [width, setWidth] = useState(400);
	const [mainMinWidth, setMainMinWidth] = useState(320);
	const [completedResize, setCompletedResize] = useState<PanelResizeEnd | null>(null);
	const chatEnabled = fg('platform-dst-chat-panel-layout');
	return (
		<>
			<Root UNSAFE_dangerouslyHoistSlotSizes>
				<TopNav height={56}>
					<TopNavStart
						sideNavToggleButton={
							<SideNavToggleButton
								collapseLabel="Collapse navigation"
								expandLabel="Expand navigation"
							/>
						}
					>
						<Button onClick={() => setOpen(true)}>Open preview</Button>
						{chatEnabled && <Button onClick={() => setChatOpen(true)}>Open chat</Button>}
					</TopNavStart>
				</TopNav>
				<SideNav testId="caller-side-nav" defaultWidth={320}>
					<SideNavBody>
						<Box padding="space.200">Product navigation</Box>
					</SideNavBody>
					<SideNavPanelSplitter label="Resize navigation" testId="caller-side-splitter" />
				</SideNav>
				<Main minWidth={mainMinWidth}>
					<PanelLayout
						testId="caller-layout"
						isPanelOpen={open}
						panelKey={content}
						panelWidth={width}
						panelMaxWidth={600}
						onPanelWidthChange={setWidth}
						onResizeEnd={setCompletedResize}
						panelLabel="Preview"
						resizeLabel="Resize preview"
						panel={
							<Box padding="space.300">
								<Stack space="space.200">
									<Heading size="medium" as="h2">
										{content}
									</Heading>
									<p>
										Caller-owned content. The layout handles width, scrolling, motion and resizing.
									</p>
									<Button onClick={() => setOpen(false)}>Close preview</Button>
									<Button
										onClick={() =>
											setContent(content === 'First preview' ? 'Second preview' : 'First preview')
										}
									>
										Replace preview
									</Button>
								</Stack>
							</Box>
						}
					>
						<Box padding="space.300">
							<Stack space="space.200">
								<Heading size="large" as="h1">
									Caller-owned panels
								</Heading>
								<p>Requested width: {width}px</p>
								<Button onClick={() => setWidth(480)}>Set width to 480</Button>
								<Button onClick={() => setMainMinWidth(500)}>Set Main minimum to 500</Button>
								<p data-testid="caller-resize-result">
									{completedResize ? JSON.stringify(completedResize) : 'No completed resize'}
								</p>
							</Stack>
						</Box>
					</PanelLayout>
				</Main>
				{chatEnabled && chatOpen && (
					<ChatPanel testId="caller-chat" defaultWidth={400} onClose={() => setChatOpen(false)}>
						<Box padding="space.300">
							<Heading size="medium" as="h2">
								Chat
							</Heading>
							<Button onClick={() => setChatOpen(false)}>Close chat</Button>
						</Box>
						<PanelSplitter label="Resize chat" testId="caller-chat-splitter" />
					</ChatPanel>
				)}
			</Root>
			<div
				data-testid="caller-panel-offset"
				style={{ width: `var(${'--n_localPanelWidth' satisfies typeof localPanelWidthVar}, 0px)` }}
			/>
		</>
	);
}
