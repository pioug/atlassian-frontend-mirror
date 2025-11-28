import React, { Fragment, useCallback, useEffect, useRef } from 'react';

import type { EntryPoint } from 'react-relay';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { useId } from '@atlaskit/ds-lib/use-id';
import Heading from '@atlaskit/heading';
import ProjectIcon from '@atlaskit/icon/core/project';
import {
	PanelActionClose,
	PanelActionGroup,
	PanelBody,
	PanelContainer,
	PanelHeader,
	PanelProvider,
	type PanelSystemState,
	PanelTitle,
	usePanelManager,
} from '@atlaskit/panel-system';
import { Box, Flex, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	layout: {
		height: '100vh',
		width: '100%',
	},
	mainContent: {
		flex: 1,
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
		backgroundColor: token('color.background.neutral.subtle'),
	},
	panelWrapper: {
		borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
		width: '480px',
	},
	buttonGroup: {
		display: 'flex',
		gap: token('space.100'),
		flexWrap: 'wrap',
	},
	stateDisplay: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		backgroundColor: token('color.background.neutral'),
	},
});

// Helper to get entry point name for display
function getEntryPointName(entryPoint: EntryPoint<any, any>): string {
	const root = entryPoint.root as any;
	return root?.getModuleName?.() || root?.getModuleId?.() || 'unknown-entrypoint';
}

// Create mock entry points for demonstration
function createMockEntryPoint(name: string): EntryPoint<any, any> {
	return {
		root: {
			getModuleId: () => name,
			getModuleName: () => name,
		} as any,
		getPreloadProps: () => ({}),
	} as EntryPoint<any, any>;
}

const rovoChatEntryPoint = createMockEntryPoint('rovo-chat');
const jiraTicketEntryPoint = createMockEntryPoint('jira-ticket');
const confluencePageEntryPoint = createMockEntryPoint('confluence-page');

function PanelRenderer({
	panel,
	manager,
}: {
	panel: PanelSystemState['activePanels'][0];
	manager: ReturnType<typeof usePanelManager>['manager'];
}) {
	const handleClose = useCallback(() => {
		manager.closePanel(panel.instanceId);
	}, [manager, panel.instanceId]);

	const entryPointName = getEntryPointName(panel.entryPoint);

	return (
		<Box xcss={styles.panelWrapper}>
			<PanelContainer testId={`panel-${panel.instanceId}`}>
				<PanelHeader>
					<PanelTitle icon={<ProjectIcon label="Panel" />}>
						{entryPointName} - {panel.instanceId}
					</PanelTitle>
					<PanelActionGroup>
						<PanelActionClose onClick={handleClose} testId={`close-${panel.instanceId}`} />
					</PanelActionGroup>
				</PanelHeader>
				<PanelBody>
					<Stack space="space.200">
						<Heading size="small" as="h3">
							Panel Content
						</Heading>
						{panel.params && Object.keys(panel.params).length > 0 && (
							<Fragment>
								<Heading size="xsmall" as="h4">
									Params:
								</Heading>
								<Box xcss={styles.stateDisplay}>
									<pre>{JSON.stringify(panel.params, null, 2)}</pre>
								</Box>
							</Fragment>
						)}
					</Stack>
				</PanelBody>
			</PanelContainer>
		</Box>
	);
}

function PanelManagerExample() {
	const { state, manager } = usePanelManager();
	const baseId = useId();
	const panelCounterRef = useRef(0);

	// Helper to close all panels of a specific entry point type
	const closePanelsByEntryPoint = useCallback(
		(entryPointName: string) => {
			state.activePanels
				.filter((p) => getEntryPointName(p.entryPoint) === entryPointName)
				.forEach((panel) => {
					manager.closePanel(panel.instanceId);
				});
		},
		[manager, state.activePanels],
	);

	const openRovoPanel = useCallback(() => {
		// Close any existing rovo panel
		closePanelsByEntryPoint('rovo-chat');
		// Open new rovo panel
		panelCounterRef.current += 1;
		const instanceId = `${baseId}-rovo-${panelCounterRef.current}`;
		manager.openPanel(instanceId, rovoChatEntryPoint, { conversation: 'main' });
	}, [manager, baseId, panelCounterRef, closePanelsByEntryPoint]);

	const openJiraPanel = useCallback(() => {
		// Close any existing jira or confluence panel (they're mutually exclusive)
		closePanelsByEntryPoint('jira-ticket');
		closePanelsByEntryPoint('confluence-page');
		// Open new jira panel
		panelCounterRef.current += 1;
		const instanceId = `${baseId}-jira-${panelCounterRef.current}`;
		manager.openPanel(instanceId, jiraTicketEntryPoint, { issueKey: 'JIRA-123' });
	}, [manager, baseId, panelCounterRef, closePanelsByEntryPoint]);

	const openConfluencePanel = useCallback(() => {
		// Close any existing jira or confluence panel (they're mutually exclusive)
		closePanelsByEntryPoint('jira-ticket');
		closePanelsByEntryPoint('confluence-page');
		// Open new confluence panel
		panelCounterRef.current += 1;
		const instanceId = `${baseId}-confluence-${panelCounterRef.current}`;
		manager.openPanel(instanceId, confluencePageEntryPoint, { pageId: 'page-789' });
	}, [manager, baseId, panelCounterRef, closePanelsByEntryPoint]);

	// Open a panel on mount for demonstration
	useEffect(() => {
		if (state.activePanels.length === 0) {
			openRovoPanel();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Flex xcss={styles.layout}>
			<Box xcss={styles.mainContent}>
				<Stack space="space.300">
					<Heading size="medium">Panel Manager Example</Heading>
					<Text>
						This example demonstrates the PanelManager API for managing panel state. Open panels,
						close them, and observe the state changes.
					</Text>

					<Stack space="space.200">
						<Heading size="small" as="h3">
							Actions
						</Heading>
						<Text color="color.text.subtle" size="small">
							Only one Rovo panel and one Jira/Confluence panel can be open at a time (max 2
							panels).
						</Text>
						<Box xcss={styles.buttonGroup}>
							<Button onClick={openRovoPanel} testId="open-rovo-button">
								Open Rovo Chat
							</Button>
							<Button onClick={openJiraPanel} testId="open-jira-button">
								Open Jira Ticket
							</Button>
							<Button onClick={openConfluencePanel} testId="open-confluence-button">
								Open Confluence Page
							</Button>
						</Box>
					</Stack>

					<Stack space="space.200">
						<Heading size="small" as="h3">
							Active Panels: {state.activePanels.length}
						</Heading>
						{state.activePanels.length === 0 ? (
							<Text color="color.text.subtle">No active panels</Text>
						) : (
							<Box xcss={styles.stateDisplay}>
								<pre>
									{JSON.stringify(
										state.activePanels.map((panel) => ({
											instanceId: panel.instanceId,
											entryPoint: getEntryPointName(panel.entryPoint),
											params: panel.params,
										})),
										null,
										2,
									)}
								</pre>
							</Box>
						)}
					</Stack>
				</Stack>
			</Box>

			{state.activePanels.map((panel) => (
				<PanelRenderer key={panel.instanceId} panel={panel} manager={manager} />
			))}
		</Flex>
	);
}

export default function PanelManagerExampleWithProvider() {
	return (
		<PanelProvider>
			<PanelManagerExample />
		</PanelProvider>
	);
}
